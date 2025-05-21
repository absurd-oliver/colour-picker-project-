/*
  Colour Picker - A simple web app
  Copyright (C) 2025 Oliver LeGallee

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
