<?php
/**
 * Plugin Name: Newsletter Subscription by Long Web Studio
 * Description: Một giải pháp quản lý danh sách đăng ký bản tin chuyên nghiệp thông qua GraphQL API, có trang quản trị nâng cao và tính năng gửi email chào mừng.
 * Version: 2.0
 * Author: Long Web Studio
 * Text Domain: newsletter-subscription
 */

if (!defined('ABSPATH')) {
    exit; // Thoát nếu truy cập trực tiếp.
}

// Tạo bảng khi kích hoạt plugin
function newsletter_subscription_activate() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscriptions';

    $charset_collate = $wpdb->get_charset_collate();

    // Lưu ý: dbDelta yêu cầu 2 khoảng trắng sau PRIMARY KEY
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        email varchar(100) NOT NULL,
        subscribed_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'newsletter_subscription_activate');

// Đăng ký GraphQL mutation cho newsletter subscription
add_action('graphql_register_types', function() {
    register_graphql_mutation(
        'subscribeToNewsletter',
        [
            'inputFields' => [
                'email' => [
                    'type' => 'String',
                    'description' => __('The email of the user to subscribe.', 'newsletter-subscription'),
                ],
            ],
            'outputFields' => [
                'success' => [
                    'type' => 'Boolean',
                    'description' => __('Whether or not the subscription was successful.', 'newsletter-subscription'),
                ],
                'message' => [
                    'type' => 'String',
                    'description' => __('A message about the result of the subscription.', 'newsletter-subscription'),
                ],
            ],
            'mutateAndGetPayload' => function($input) {
                global $wpdb;
                $table_name = $wpdb->prefix . 'newsletter_subscriptions';

                $email = sanitize_email($input['email']);

                if (!is_email($email)) {
                    return [
                        'success' => false,
                        'message' => __('Email không hợp lệ.', 'newsletter-subscription'),
                    ];
                }

                $existing_subscriber = $wpdb->get_row(
                    $wpdb->prepare("SELECT * FROM $table_name WHERE email = %s", $email)
                );

                if ($existing_subscriber) {
                    return [
                        'success' => false,
                        'message' => __('Email này đã được đăng ký từ trước.', 'newsletter-subscription'),
                    ];
                }

                $wpdb->insert(
                    $table_name,
                    [
                        'email' => $email,
                        'subscribed_at' => current_time('mysql')
                    ]
                );

                // Gửi email chào mừng
                $subject = __('Cảm ơn bạn đã đăng ký nhận tin từ hotham.vn', 'newsletter-subscription');
                $message = '<p>' . __('Chào bạn,', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Cảm ơn bạn đã đăng ký nhận bản tin từ hotham.vn.', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Tôi là Hồ Thị Thắm, chuyên gia tư vấn Bảo hiểm xã hội & Bảo hiểm y tế với hơn 10 năm kinh nghiệm. Sứ mệnh của tôi là mang đến sự an tâm và đảm bảo quyền lợi về sức khỏe, an sinh xã hội cho mọi người.', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Blog này là nơi tôi tổng hợp, chia sẻ những kiến thức pháp luật bảo hiểm dễ hiểu, giúp mọi người nắm bắt quyền lợi của mình một cách tốt nhất.', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Tôi sẽ sớm gửi cho bạn những thông tin hữu ích.', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Trân trọng,', 'newsletter-subscription') . '</p>';
                $message .= '<p>' . __('Hồ Thị Thắm', 'newsletter-subscription') . '</p>';
                $headers = ['Content-Type: text/html; charset=UTF-8'];

                wp_mail($email, $subject, $message, $headers);

                return [
                    'success' => true,
                    'message' => __('Đăng ký thành công! Vui lòng kiểm tra email của bạn.', 'newsletter-subscription'),
                ];
            },
        ]
    );
});

// Thêm trang quản lý trong Admin Dashboard
add_action('admin_menu', 'newsletter_subscription_admin_menu');

function newsletter_subscription_admin_menu() {
    add_menu_page(
        __('Danh sách Email', 'newsletter-subscription'), // Page title
        __('Email', 'newsletter-subscription'), // Menu title
        'manage_options', // Capability
        'newsletter-subscriptions', // Menu slug
        'newsletter_subscription_admin_page', // Function
        'dashicons-email-alt', // Icon
        20 // Position
    );
}

// Tính năng chuyên nghiệp: Xử lý xuất CSV sớm trước khi HTML của trang quản trị tải ra
add_action('admin_init', 'newsletter_subscription_export_csv');

function newsletter_subscription_export_csv() {
    if (isset($_GET['action']) && $_GET['action'] === 'export_csv') {
        if (!current_user_can('manage_options')) {
            wp_die(__('Bạn không có quyền thực hiện hành động này.', 'newsletter-subscription'));
        }

        check_admin_referer('export_subscribers_csv');

        global $wpdb;
        $table_name = $wpdb->prefix . 'newsletter_subscriptions';
        
        $subscribers = $wpdb->get_results("SELECT * FROM $table_name ORDER BY subscribed_at DESC", ARRAY_A);

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=newsletter_subscribers_' . date('Y-m-d') . '.csv');
        
        $output = fopen('php://output', 'w');
        
        // Thêm ký tự BOM (Byte Order Mark) để hiển thị đúng bảng mã tiếng Việt trong Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Ghi dòng tiêu đề
        fputcsv($output, [
            __('ID', 'newsletter-subscription'), 
            __('Email', 'newsletter-subscription'), 
            __('Thời gian đăng ký', 'newsletter-subscription')
        ]);

        if ($subscribers) {
            foreach ($subscribers as $row) {
                fputcsv($output, [$row['id'], $row['email'], $row['subscribed_at']]);
            }
        }
        fclose($output);
        exit;
    }
}

// Giao diện quản lý nâng cao (Tìm kiếm, Phân trang)
function newsletter_subscription_admin_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscriptions';

    // 1. Xử lý xóa email
    if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
        if (!current_user_can('manage_options')) {
            wp_die(__('Bạn không có quyền thực hiện hành động này.', 'newsletter-subscription'));
        }

        $id = intval($_GET['id']);
        
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'delete_subscriber_' . $id)) {
            wp_die(__('Yêu cầu bảo mật không hợp lệ.', 'newsletter-subscription'));
        }

        $wpdb->delete($table_name, ['id' => $id]);
        echo '<div class="updated"><p>' . esc_html__('Đã xóa email thành công.', 'newsletter-subscription') . '</p></div>';
    }

    // 2. Logic Tìm kiếm và Phân trang (Pagination) chuyên nghiệp
    $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
    $paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
    $per_page = 20; // Số lượng bản ghi trên một trang
    $offset = ($paged - 1) * $per_page;

    $where = '';
    $params = [];
    if (!empty($search)) {
        $where = "WHERE email LIKE %s";
        $params[] = '%' . $wpdb->esc_like($search) . '%';
    }

    // Đếm tổng số bản ghi phù hợp để tính toán phân trang
    if (!empty($where)) {
        $total_items = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name $where", $params));
    } else {
        $total_items = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    }
    $total_pages = ceil($total_items / $per_page);

    // Lấy dữ liệu phân trang từ Database
    $query = "SELECT * FROM $table_name $where ORDER BY subscribed_at DESC LIMIT %d OFFSET %d";
    $query_params = array_merge($params, [$per_page, $offset]);
    $subscribers = $wpdb->get_results($wpdb->prepare($query, $query_params));

    // Link tạo File CSV xuất danh sách
    $export_url = wp_nonce_url(
        admin_url('admin.php?page=newsletter-subscriptions&action=export_csv'),
        'export_subscribers_csv'
    );
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline"><?php esc_html_e('Danh sách Email', 'newsletter-subscription'); ?></h1>
        <a href="<?php echo esc_url($export_url); ?>" class="page-title-action"><?php esc_html_e('Xuất file CSV', 'newsletter-subscription'); ?></a>
        <hr class="wp-header-end">

        <!-- Form tìm kiếm -->
        <form method="get" style="margin-bottom: 15px; margin-top: 15px;">
            <input type="hidden" name="page" value="newsletter-subscriptions" />
            <p class="search-box" style="position: static; float: right; margin: 0 0 10px 0;">
                <label class="screen-reader-text" for="subscriber-search-input"><?php esc_html_e('Tìm kiếm:', 'newsletter-subscription'); ?></label>
                <input type="search" id="subscriber-search-input" name="s" value="<?php echo esc_attr($search); ?>" placeholder="<?php esc_attr_e('Nhập email...', 'newsletter-subscription'); ?>" />
                <input type="submit" id="search-submit" class="button" value="<?php esc_html_e('Tìm kiếm', 'newsletter-subscription'); ?>" />
            </p>
            <div style="clear: both;"></div>
        </form>

        <!-- Bảng hiển thị dữ liệu -->
        <table class="wp-list-table widefat fixed striped" style="margin-top: 10px;">
            <thead>
                <tr>
                    <th style="width: 60px;"><?php esc_html_e('ID', 'newsletter-subscription'); ?></th>
                    <th><?php esc_html_e('Email', 'newsletter-subscription'); ?></th>
                    <th style="width: 250px;"><?php esc_html_e('Thời gian đăng ký', 'newsletter-subscription'); ?></th>
                    <th style="width: 120px;"><?php esc_html_e('Hành động', 'newsletter-subscription'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php if ($subscribers) : ?>
                    <?php foreach ($subscribers as $subscriber) : ?>
                        <tr>
                            <td><?php echo intval($subscriber->id); ?></td>
                            <td><strong><?php echo esc_html($subscriber->email); ?></strong></td>
                            <td>
                                <?php 
                                $date_format = get_option('date_format') . ' ' . get_option('time_format');
                                echo esc_html(mysql2date($date_format, $subscriber->subscribed_at)); 
                                ?>
                            </td>
                            <td>
                                <?php
                                $delete_url = wp_nonce_url(
                                    add_query_arg(
                                        [
                                            'page'   => 'newsletter-subscriptions',
                                            'action' => 'delete',
                                            'id'     => $subscriber->id,
                                        ],
                                        admin_url('admin.php')
                                    ),
                                    'delete_subscriber_' . $subscriber->id
                                );
                                ?>
                                <a href="<?php echo esc_url($delete_url); ?>" class="submitdelete" style="color: #b32d2e;" onclick="return confirm('<?php esc_html_e('Bạn có chắc chắn muốn xóa email này không?', 'newsletter-subscription'); ?>')">
                                    <?php esc_html_e('Xóa liên hệ', 'newsletter-subscription'); ?>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 20px;">
                            <?php esc_html_e('Chưa có email nào trong hệ thống.', 'newsletter-subscription'); ?>
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <!-- Thanh phân trang (Pagination UI) -->
        <?php if ($total_pages > 1) : ?>
            <div class="tablenav bottom" style="margin-top: 15px;">
                <div class="tablenav-pages">
                    <span class="displaying-num">
                        <?php printf(_n('%s người đăng ký', '%s người đăng ký', $total_items, 'newsletter-subscription'), number_format_i18n($total_items)); ?>
                    </span>
                    <span class="pagination-links">
                        <?php
                        echo paginate_links([
                            'base'      => add_query_arg('paged', '%#%'),
                            'format'    => '',
                            'prev_text' => __('&laquo;', 'newsletter-subscription'),
                            'next_text' => __('&raquo;', 'newsletter-subscription'),
                            'total'     => $total_pages,
                            'current'   => $paged,
                        ]);
                        ?>
                    </span>
                </div>
            </div>
        <?php endif; ?>
    </div>
    <?php
}