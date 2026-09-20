<?php
// submit.php
// Secure middleman script for Cloudflare Turnstile & Zoho Forms

// 1. Cloudflare Turnstile configuration
$turnstile_secret = '0x4AAAAAAE9ziWNkQo8vy1S-29nlJqMa6cg';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $turnstile_response = $_POST['cf-turnstile-response'] ?? '';

    // Verify token with Cloudflare
    $verify_url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $data = [
        'secret' => $turnstile_secret,
        'response' => $turnstile_response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    $ch = curl_init($verify_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    $response = curl_exec($ch);
    curl_close($ch);

    $outcome = json_decode($response);

    if ($outcome && $outcome->success) {
        // Captcha passed. Forward form data to Zoho

        $zoho_endpoint = 'https://forms.zohopublic.sa/ZEDESIGNS/form/LeadForm/formperma/QhtzwiDql30ilttZavvUDlFWgv1KUqSHEqH-0a6G-sM/htmlRecords/submit';

        // Remove turnstile response from payload so we don't send it to Zoho
        unset($_POST['cf-turnstile-response']);

        // Reconstruct form data exactly as standard HTML form submission
        $post_fields = [];
        foreach ($_POST as $key => $value) {
            if (is_array($value)) {
                // Handle multi-select fields (e.g. MultipleChoice)
                foreach ($value as $v) {
                    $post_fields[] = urlencode($key) . '=' . urlencode($v);
                }
            } else {
                $post_fields[] = urlencode($key) . '=' . urlencode($value);
            }
        }
        $post_string = implode('&', $post_fields);

        $ch_zoho = curl_init($zoho_endpoint);
        curl_setopt($ch_zoho, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch_zoho, CURLOPT_POST, true);
        curl_setopt($ch_zoho, CURLOPT_POSTFIELDS, $post_string);
        curl_setopt($ch_zoho, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));

        $zoho_response = curl_exec($ch_zoho);
        curl_close($ch_zoho);

        // Redirect back to contact page showing sleek success modal
        header("Location: contact.html?submitted=true");
        exit();

    } else {
        // Captcha failed
        header("Location: contact.html?error=captcha");
        exit();
    }
} else {
    // If accessed directly without POST
    header("Location: contact.html");
    exit();
}
