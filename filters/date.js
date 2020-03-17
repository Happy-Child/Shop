import Vue from 'vue'

function date(value, type = 'date') {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if(type.includes('time')) {
    options.hour = 'numeric';
    options.minute = 'numeric';
    options.second = 'numeric';
  }
  
  return new Intl.DateTimeFormat('ru-RU', options).format(value);
}

Vue.filter('date', date);
