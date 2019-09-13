import double from '#/double'
import fib from '#/fib'
const { compose } = require('ramda')

const doubleFib = compose(double, fib)

export default doubleFib

console.log(doubleFib(3))
