import { execFile } from 'child_process';

execFile("./file.sh", (err, stdout, stderr) => {
    if (err) {
      console.log("error");
      console.log(err.message);
    }
    if (stderr) {
      console.log("standard error");
      console.log(stderr);
    }
    console.log("standard output");
    console.log(stdout);
  })