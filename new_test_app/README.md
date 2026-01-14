# React + Vite

node version 18.10.8

1 first remove node_module
2 npm install 
3 npm install -g netlify-cli
4 netlify login

# to run: 
netlify dev

# test daily schedul task
node ./netlify/functions/test_run_daily_task.js


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
