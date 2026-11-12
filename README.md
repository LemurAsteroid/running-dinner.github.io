<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Running dinner – your evening</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<main>
  <h1>Running dinner</h1>
  <p class="lead">Enter the names of both partners of your team to see where you eat each course and what your guests eat.</p>

  <form id="form" autocomplete="off">
    <label>Partner 1<input id="p1" required placeholder="e.g. Fatima"></label>
    <label>Partner 2<input id="p2" required placeholder="e.g. Yassine"></label>
    <button id="submit" type="submit" disabled>Show my evening</button>
  </form>

  <div id="error" class="hide" role="alert"></div>

  <section id="result" class="hide" aria-live="polite">
    <h2 id="teamName"></h2>
    <div class="wrap">
      <table>
        <thead><tr><th>Course</th><th>Address</th><th>Contact</th><th>Eating habits of guests</th><th>Comments of guests</th></tr></thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
  </section>
</main>
<script src="script.js"></script>
</body>
</html>