<!doctype html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <title>Task 1</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div id="container">
    <?php
    require_once 'db.php';
    incCounter();
    $counter = getCounter();
    $currentTime = date('H:i');
    echo "Страница была загружена $counter раз. Текущее время $currentTime.";
    ?>
  </div>
</body>

</html>