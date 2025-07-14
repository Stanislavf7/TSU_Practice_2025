<!doctype html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <title>Task 2</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div id="container">
    <div id="commentsBlock">
      <?php
      require_once 'db.php';

      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        setComment();
        header('Location: index.php');
      }

      $comments = getComments();
      if ($comments) {
        foreach ($comments as $comment) {
          echo "<div class='comment'>";
          echo "<div id='commentHead'><p>" . ($comment['created_at']) . "</p><p>" . ($comment['username']) . "</div>";
          echo "<p id='commentbody'>" . (($comment['message'])) . "</p>";
          echo "</div>";
        }
      } else {
        echo "<p>Комментариев пока нет.</p>";
      }
      ?>
    </div>
    <form method="POST" id="myForm">
      <input type="text" id="username" name="username" placeholder="Ваше имя" />
      <textarea id="message" name="message" placeholder="Ваш комментарий" required></textarea>
      <button type="submit">Отправить</button>
    </form>
  </div>
</body>

</html>