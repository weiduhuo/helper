// ==UserScript==
// @name         Bilibili Bangumi Upload Date Extractor
// @namespace    https://github.com/bangumi-data/helper
// @version      0.1
// @description  Extracts the upload date from Bilibili bangumi pages and displays both UTC and local time in a floating widget
// @author       weiduhuo
// @match        https://www.bilibili.com/bangumi/play/ep*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
    div.upload-Date-box {
      position: fixed;
      top: 60px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.75);
      color: rgb(255, 255, 255);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      white-space: pre-line;
      z-index: 9999;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 8px;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('load', main);

  function main() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    let foundDate = null;

    for (const script of scripts) {
      const text = script.textContent;
      const match = text.match(/"uploadDate"\s*:\s*"(.+?)"/);
      if (match) {
        foundDate = match[1];
        break;
      }
    }

    const floatBox = document.createElement('div');
    floatBox.className = 'upload-Date-box';
    if (foundDate) {
      const utc = foundDate;
      const localFormatted = formatLocalDate(new Date(foundDate));
      floatBox.textContent = `Upload date\n${utc}\n${localFormatted}`;
    } else {
      floatBox.textContent = 'No upload Date found';
    }

    document.body.appendChild(floatBox);
  }

  function formatLocalDate(date) {
    const pad = n => String(n).padStart(2, '0');
    const YYYY = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const DD = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    const offsetMin = date.getTimezoneOffset();
    const offsetHr = Math.floor(Math.abs(offsetMin) / 60);
    const offsetM = Math.abs(offsetMin) % 60;
    const sign = offsetMin <= 0 ? '+' : '-';
    const timezone = `${sign}${pad(offsetHr)}:${pad(offsetM)}`;

    return '' +
      `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss} ${timezone}` + '\n' +
      `${YYYY}${MM}${DD}${hh}${mm}${ss}`
    ;
  }
})();
