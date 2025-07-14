<?php

$db = new PDO('sqlite:database.db');
$db->exec("CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY, load_counter INTEGER DEFAULT 0)");
$db->exec("INSERT OR IGNORE INTO counter (id, load_counter) VALUES (1, 0)");

function getCounter(){
  global $db;
  $stmt = $db->prepare("SELECT load_counter FROM counter WHERE id = 1");
  $stmt->execute();
  $counter = $stmt->fetchColumn();
  return $counter;
}

function incCounter(){
  global $db;
  $stmt = $db->prepare("UPDATE counter SET load_counter = load_counter + 1 WHERE id = 1");
  $stmt->execute();
}
