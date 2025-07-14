<?php

$db = new PDO('sqlite:database.db');
$db->exec("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, username TEXT, message TEXT, created_at TEXT)");


function setComment()
{
  global $db;
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = !empty($_POST['username']) ? $_POST['username'] : 'аноним';
    $message = $_POST['message'] ?? '';
    $created_at = date('Y-m-d H:i:s');

    if ($message) {
      $stmt = $db->prepare("INSERT INTO comments (username, message, created_at) VALUES (?, ?, ?)");
      $stmt->execute([$username, $message, $created_at]);
    }
  }
}

function getComments()
{
  global $db;
  $stmt = $db->query("SELECT * FROM comments ORDER BY created_at DESC");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
