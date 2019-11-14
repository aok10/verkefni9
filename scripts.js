const API_URL = 'https://apis.is/company?name=';

const program = (() => {
  let input;
  let results;

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function el(tag, ...children) {
    const element = document.createElement(tag);
    for (let child of children) { /*eslint-disable-line*/
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }
    return element;
  }

  function loading() {
    empty(results);
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    img.setAttribute('alt', 'loading icon');
    const imgDiv = el('div', img, 'Leita að fyrirtækjum...');
    imgDiv.classList.add('loading');
    results.appendChild(imgDiv);
  }

  function showMessage(message) {
    empty(results);
    const elem = el('p', message);
    results.appendChild(elem);
  }

  function showBorderAll() {
    const resultsc = document.querySelector('.results');
    resultsc.querySelectorAll('div').forEach((div) => {
      div.classList.add('company');
    });
  }

  function showData(data) {
    if (data.length === 0) {
      showMessage('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }
    empty(results);
    for (const dataobject of data) { /*eslint-disable-line*/

      const {
        name, sn, active, address,
      } = dataobject;
      const div = document.createElement('div');
      results.appendChild(div);
      const result = el('dl',
        el('dd', name),
        el('dt', 'Nafn'),
        el('dd', sn),
        el('dt', 'Kennitala'),
        active ? el('dd', address) : null,
        active ? el('dt', 'Heimilisfang') : null);
      div.appendChild(result);
      if (active) {
        div.classList.add('company--active');
      } else {
        div.classList.add('company--inactive');
      }
    }

    showBorderAll();
  }

  function fetchResults(company) {
    loading();
    fetch(`${API_URL}${company}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error('Non 200 status');
        }
        return result.json();
      })
      .then((data) => showData(data.results))
      .catch((error) => {
        console.error(error);
        showMessage('Villa við að sækja gögn');
      });
  }

  function formHandler(e) {
    e.preventDefault();
    if (input.value.trim() === '') {
      showMessage('Lén verður að vera strengur');
    } else {
      fetchResults(input.value);
    }
  }

  function init(companies) {
    input = companies.querySelector('input');
    results = companies.querySelector('.results');
    const form = document.querySelector('form');

    form.addEventListener('submit', formHandler);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('main');
  program.init(companies);
});
