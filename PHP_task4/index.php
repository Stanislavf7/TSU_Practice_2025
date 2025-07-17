<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();
$app->setBasePath('/TSU_Practice_2025/PHP_task4');

$db = new PDO('sqlite:database.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$app->get('/', function (Request $request, Response $response, $args) {
    $response->getBody()->write("Hello world!");
    return $response;
});

// GET /api/products/ - Список товаров
$app->get('/api/products/', function (Request $request, Response $response) use ($db) {
    $stmt = $db->query('
        SELECT p.product_id, p.product_name, m.manufacturer_name, c.category_name
        FROM products p
        JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
        JOIN categories c ON p.category_id = c.category_id
    ');
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response->getBody()->write(json_encode($products));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
});

// GET /api/products/{id}/ - Информация о товаре
$app->get('/api/products/{id}/', function (Request $request, Response $response, $args) use ($db) {
    $id = $args['id'];
    $stmt = $db->prepare('
        SELECT p.product_id, p.product_name, m.manufacturer_name, c.category_name
        FROM products p
        JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
        JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = ?
    ');
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$product) {
        $response->getBody()->write(json_encode(['error' => 'Product not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }
    $response->getBody()->write(json_encode($product));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
});

// POST /api/products/ - Добавить товар
$app->post('/api/products/', function (Request $request, Response $response) use ($db) {
    $data = json_decode($request->getBody()->getContents(), true);
    if (!isset($data['product_name']) || !isset($data['manufacturer_id']) || !isset($data['category_id'])) {
        $response->getBody()->write(json_encode(['error' => 'Invalid input']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    // Проверка существования manufacturer_id и category_id
    $stmt = $db->prepare('SELECT 1 FROM manufacturers WHERE manufacturer_id = ?');
    $stmt->execute([$data['manufacturer_id']]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Invalid manufacturer_id']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $stmt = $db->prepare('SELECT 1 FROM categories WHERE category_id = ?');
    $stmt->execute([$data['category_id']]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Invalid category_id']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $stmt = $db->prepare('INSERT INTO products (product_name, manufacturer_id, category_id) VALUES (?, ?, ?)');
    $stmt->execute([$data['product_name'], $data['manufacturer_id'], $data['category_id']]);
    $newId = $db->lastInsertId();
    $response->getBody()->write(json_encode(['message' => 'Product created', 'product_id' => $newId]));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
});

// PUT /api/products/{id}/ - Обновить товар
$app->put('/api/products/{id}/', function (Request $request, Response $response, $args) use ($db) {
    $id = $args['id'];
    $data = json_decode($request->getBody()->getContents(), true);
    if (!isset($data['product_name']) || !isset($data['manufacturer_id']) || !isset($data['category_id'])) {
        $response->getBody()->write(json_encode(['error' => 'Invalid input']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    // Проверка существования manufacturer_id и category_id
    $stmt = $db->prepare('SELECT 1 FROM manufacturers WHERE manufacturer_id = ?');
    $stmt->execute([$data['manufacturer_id']]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Invalid manufacturer_id']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    $stmt = $db->prepare('SELECT 1 FROM categories WHERE category_id = ?');
    $stmt->execute([$data['category_id']]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Invalid category_id']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
    }
    // Проверка существования продукта
    $stmt = $db->prepare('SELECT 1 FROM products WHERE product_id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Product not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }
    // Обновление
    $stmt = $db->prepare('UPDATE products SET product_name = ?, manufacturer_id = ?, category_id = ? WHERE product_id = ?');
    $stmt->execute([$data['product_name'], $data['manufacturer_id'], $data['category_id'], $id]);
    $response->getBody()->write(json_encode(['message' => 'Product updated']));
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
});

// DELETE /api/products/{id}/ - Удалить товар
$app->delete('/api/products/{id}/', function (Request $request, Response $response, $args) use ($db) {
    $id = $args['id'];
    $stmt = $db->prepare('SELECT 1 FROM products WHERE product_id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        $response->getBody()->write(json_encode(['error' => 'Product not found']));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
    }
    $stmt = $db->prepare('DELETE FROM products WHERE product_id = ?');
    $stmt->execute([$id]);
    return $response->withHeader('Content-Type', 'application/json')->withStatus(204);
});

$app->run();
