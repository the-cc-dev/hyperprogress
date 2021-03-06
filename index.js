
function create (tag, classname, children) {
  var el = document.createElement(tag)
  classname && el.classList.add(classname)
  children && children.forEach(function (e) {
    console.log('append', e)
    el.appendChild(
      'string' === typeof e ? document.createTextNode(e) : e
    )
  })
  return el
}

module.exports = function (steps) {
  var list = create('ul', 'hyperprogress__list')
  var error = create('pre', 'hyperprogress__error')
  var liquid = create('div', 'hyperprogress__liquid', ['.'])
  var bar = create('div', 'hyperprogress__bar', [liquid])
  liquid.style.width = '0%'

  var n = 0

  var prog = create('div', 'hyperprogress', [
    steps ? bar : '',
    list,
    //only show bar if a number of steps is provided.
    error
  ])

  prog.complete = function () {
    liquid.style.width = '100%'
    prog.classList.add('hyperprogress--complete')
  }

  prog.next = function (name) {
    n = Math.min(n+1, steps)
    if(list.lastChild)
      list.lastChild.classList.add('hyperprogress--okay')

    if(name)
      list.appendChild(create('li', 'hyperprogress__started', [name]))

    liquid.style.width = Math.round((n/steps)*100)+'%'

    if(n === steps)
      prog.complete()
  }

  prog.fail = function (err) {
    prog.classList.add('hyperprogress--failed')
    list.lastChild.classList.add('hyperprogress--error')
    if(err && err.stack)
      error.textContent = err.stack
    else if(err && err.name && err.message)
      error.textContent = err.name + ': ' + err.message
    else
      error.textContent = JSON.stringify(err)
  }

  prog.reset = function () {
    n = 0
    error.innerHTML = list.innerHTML = ''
    liquid.style.width = '0%'
    return prog
  }

  return prog
}




