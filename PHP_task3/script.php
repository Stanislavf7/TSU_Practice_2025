<?php

function getCities()
{
  $url = 'http://exercise.develop.maximaster.ru/service/city/';
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($ch);
  if ($response === false) {
    return [];
  }
  $cities = json_decode($response, true);
  return $cities;
}

function loadCities()
{
  if (file_exists('cities_cache.json')) {
    if (time() - filemtime('cities_cache.json') > 86400) {
      $cities = getCities();
      if (!empty($cities)) {
        file_put_contents('cities_cache.json', json_encode($cities));
      }
    } else {
      $cities = json_decode(file_get_contents('cities_cache.json'), true);
    }
  } else {
    $cities = getCities();
    if (!empty($cities)) {
      file_put_contents('cities_cache.json', json_encode($cities));
    }
  }
  return $cities;
}

function getPrice($weight, $city)
{
  $url = 'http://exercise.develop.maximaster.ru/service/delivery/';
  $params = http_build_query(['weight' => $weight, 'city' => $city]);
  $ch = curl_init($url . '?' . $params);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  $response = curl_exec($ch);
  if ($response === false) {
    return ['Ошибка запроса.', 'error'];
  }
  $data = json_decode($response, true);
  return [$data['message'], $data['status']];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $weight = $_POST['weight'] ?? 0;
    $city = $_POST['city'] ?? '';
    if ($weight > 0 && !empty($city)) {
        [$message, $status] = getPrice($weight, $city);
        echo "<p class='$status'>$message</p>";
    } else {
        echo "<p class='error'>Пожалуйста, выберите город и укажите правильный вес.</p>";
    }
    exit;
}
