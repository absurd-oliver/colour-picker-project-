const fs = require('fs');

//Read the files
const html = fs.readFileSync('index.html', 'utf-8');
const css = fs.readFileSync('styles.css', 'utf-8');
const js = fs.readFileSync('code.js', 'utf-8');

//inline the css and js into the html
const result = html
  .replace(
    /<link\s+rel="stylesheet"\s+href="styles\.css"\s*\/?>/i,
    `<style>\n${css}\n</style>`
  )

  .replace(
    /<script\s+src="code\.js"\s*><\/script>/i,
    `<script>\n${js}\n</script>`
  )

  //write to a new standalone html file
  fs.writeFileSync('standalone.html', result, 'utf-8');

  console.log('standalone.html updated!');
