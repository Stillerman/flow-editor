import { createSkeleton } from './skeleton'
import { createServer } from './server'

createSkeleton ('../DevExample').then(createServer).then(app => {
    console.log('Server Running')
})