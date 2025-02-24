export const DOTFILE = {
    name: "New Project",
    blocks: "./blocks"
}


export const packageJson = {
"name": "Server",
"version": "1.0.0",
"main": "index.js",
"bin": {
    "flow": "bin/flow"
},
"license": "MIT",
"dependencies": {
    "commander": "^2.20.0",
    "cors": "^2.8.5",
    "esm": "^3.2.25",
    "express": "^4.17.1",
    "parcel-bundler": "^1.12.3",
    "ramda": "^0.26.1",
    "vue": "^2.6.10"
},
"scripts": {
    "dev": "nodemon index.js -i workdir"
}
}
      