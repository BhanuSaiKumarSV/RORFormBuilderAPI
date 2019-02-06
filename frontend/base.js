var optionCount = 0;
var formData = [];

validateData = formData => {
  let options = {};
  const { name, type, required, order } = formData;
  if (name == '' || order == '') {
    return false;
  }
  switch (type) {
    case 'number':
      let minRange = document.getElementById('min-range').value;
      let maxRange = document.getElementById('max-range').value;
      if (
        minRange == '' ||
        maxRange == '' ||
        minRange > maxRange ||
        minRange == maxRange
      ) {
        return false;
      }
      options.minRange = minRange;
      options.maxRange = maxRange;
      break;
    case 'checkboxes':
    case 'select':
    case 'radio':
      let tempCount = optionCount;
      while (tempCount) {
        let name = document.getElementById(`name${tempCount}`).value;
        let value = document.getElementById(`value${tempCount}`).value;
        if (name == '' || value == '') {
          return false;
        }
        tempCount--;
        options[name] = value;
      }
      break;
    case 'text':
    case 'textarea':
      if (document.getElementById('regex').value !== '') {
        options.regex = document.getElementById('regex').value;
      }
  }
  return options;
};

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

function addFormElementsToRightPane() {
  // window.alert('sdfsdf',formData)
  var rightForm = document.getElementById('form-fields');
  rightForm.innerHTML = null;
  console.log(formData);
  formData = sortByKey(formData, 'order');

  formData.forEach((ele, index) => {
    switch (ele.type) {
      case 'text':
        var fieldName = document.createElement('span');
        var input = document.createElement('input');
        fieldName.innerHTML = ele.name;
        input.type = ele.type;
        input.required = ele.required;
        input.className = 'form-control';
        if (ele.options.regex) {
          input.pattern = ele.options.regex;
        }
        fieldName.innerHTML += input.outerHTML;
        rightForm.appendChild(fieldName);
        break;
      case 'textarea':
        var fieldName = document.createElement('span');
        var textArea = document.createElement('textarea');
        fieldName.innerHTML = ele.name;
        textArea.className = 'form-control';
        textArea.required = ele.required;
        fieldName.innerHTML += textArea.outerHTML;
        rightForm.appendChild(fieldName);
        break;
      case 'number':
        var fieldName = document.createElement('span');
        fieldName.innerHTML = ele.name;
        var input = document.createElement('input');
        input.className = 'form-control';
        input.type = ele.type;
        input.min = ele.options.minRange;
        input.required = ele.required;
        input.max = ele.options.maxRange;
        fieldName.innerHTML += input.outerHTML;
        rightForm.appendChild(fieldName);
        break;
      case 'checkboxes':
        var label = document.createElement('label');
        Object.keys(ele.options).forEach(opt => {
          var checkBox = document.createElement('input');
          checkBox.className = 'form-control-btn';
          checkBox.required = ele.required;
          checkBox.type = 'checkbox';
          checkBox.name = opt;
          checkBox.value = ele.options[opt];

          label.appendChild(checkBox);
          label.appendChild(document.createTextNode(opt));
        });

        rightForm.appendChild(label);
        break;
      case 'select':
        var select = document.createElement('select');
        Object.keys(ele.options).forEach(opt => {
          var option = document.createElement('option');
          option.className = 'form-control';
          option.required = ele.required;
          option.text = opt;
          option.value = ele.options[opt];
          select.appendChild(option);
        });
        rightForm.appendChild(select);
        break;
      case 'radio':
        var label = document.createElement('label');

        Object.keys(ele.options).forEach(opt => {
          var radio = document.createElement('input');
          radio.className = 'form-control-btn';
          radio.type = 'radio';
          radio.name = ele.name;
          radio.required = ele.required;
          radio.value = ele.options[opt];

          label.appendChild(radio);
          label.appendChild(document.createTextNode(opt));
        });

        rightForm.appendChild(label);
        break;
      case 'date':
        var fieldName = document.createElement('span');
        fieldName.innerHTML = ele.name;
        var input = document.createElement('input');
        input.className = 'form-control';
        input.required = ele.required;
        input.type = ele.type;
        fieldName.innerHTML += input.outerHTML;
        rightForm.appendChild(fieldName);
        break;
    }
    rightForm.appendChild(document.createElement('br'));
  });
  var divElement = document.createElement('div');
  divElement.style = "justify-content: center;display: flex"
  var inputElement = document.createElement('input');
  inputElement.type = 'submit';
  inputElement.value = 'Save To DB';
  rightForm.onsubmit = formSubmit;
  divElement.innerHTML += inputElement.outerHTML
  rightForm.appendChild(divElement);
}

function removeElement(e, index) {
  formData.splice(index, 1);
  addFormElementsToRightPane();
  e.stopPropogation();
}

function formSubmit(e) {
  e.preventDefault();
  (async () => {
    const rawResponse = await fetch('http://10.211.0.149:3000/forms/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'FirstForm',
        content: JSON.stringify(formData),
      }),
    });
    const content = await rawResponse.json();
    if (content.success_msg == 'Your form got created !') {
      alert('Your form got created successfully!! ');
      location.reload();
    }
    console.log(content);
  })();
}

async function getAll() {
  fetch('http://10.211.0.149:3000/forms/')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    renderAllFormControls(myJson.form_data);
  });
}

function renderAllFormControls(myJson) {
    var allForms = document.getElementById('all-forms')
    myJson.forEach(e=> {
        const div = document.createElement('div')
        div.className = "form-button"
        div.innerHTML = e.name;
        allForms.appendChild(div);
    })
}

document.getElementById('create').addEventListener('click', function(e) {
  var optionCount = 0; //stop form from submitting
  let fieldData = {
    name: document.getElementById('newField-name').value,
    required: document.getElementById('newField-required').checked,
    order: document.getElementById('newField-order').value,
    type: document.getElementById('newField-type').value,
  };
  let validatedData = validateData(fieldData);
  if (!validatedData) {
    alert('Not all fields are added');
    return;
    e.preventDefault();
  }
  fieldData.options = validatedData;
  formData.push(fieldData);
  addFormElementsToRightPane();
});

typeChange = () => {
  optionCount = 0;
  let type = document.getElementById('newField-type').value;
  let options;
  switch (type) {
    case 'text':
    case 'textarea':
      options = `<label for="regex">Regex:</label> <input type="text" class="form-control" id="regex">`;
      break;
    case 'number':
      options = `<label for="range">Range: <input type="number" class="min-number" id="min-range">
                        <input type="number" class="max-number" id="max-range"> </label>
                        <br>Regex:<input type="text" class="form-control" id="regex">`;
      break;
    case 'checkboxes':
    case 'radio':
    case 'select':
      options = `<button onclick="addOption()">Add Option</button>`;
      break;
    default:
      options = ``;
  }
  document.getElementById('options').innerHTML = options;
};

addOption = () => {
  optionCount = optionCount + 1;
  var el = document.createElement('html');
  el.innerHTML = `<label for="option"><br><u>Option${optionCount}:</u><br> Name:<input type="text" class="name" id="name${optionCount}">
    <br>Value:<input type="text" class="value" id="value${optionCount}"><br> </label>`;
  document
    .getElementById('options')
    .appendChild(el.getElementsByTagName('label')[0]);
};
