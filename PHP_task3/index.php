<!doctype html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <title>Task 3</title>
  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div id="container">
    <form method="POST" id="myForm">
      <select id="select" name="city">
        <?php
        require_once 'script.php';
        $cities = loadCities();
        if ($cities) {
          foreach ($cities as $city) {
            $selected = ($city === 'Москва') ? 'selected' : '';
            echo "<option value='$city' $selected>$city</option>";
          }
        } else {
          echo "<option value=''>Города не найдены</option>";
        }
        ?>
      </select>
      <input type="number" name="weight" placeholder="Вес, кг" id="weight" />
      <button type="submit">Рассчитать</button>
    </form>
    <div id="result"></div>
    <script>
      document.getElementById('myForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        try {
          const response = await fetch('script.php', {
            method: 'POST',
            body: formData
          });
          const result = await response.text();
          document.getElementById('result').innerHTML = result;
        } catch (error) {
          document.getElementById('result').innerHTML = '<p class="error">Ошибка запроса.</p>';
        }
      });
    </script>
  </div>
</body>


</html>