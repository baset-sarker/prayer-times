import { handler } from './daily-task.js';

handler()
  .then(res => {
    console.log('Handler result:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });