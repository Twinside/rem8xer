//@ts-ignore
import * as W from '../m8-files/pkg/m8_files';

// Don't worry if vscode told you can't find my-crate
// It's because you're using a local crate
// after yarn dev, wasm-pack plugin will install my-crate for you

document.write(W.a_number().toString());

/*
init().then(() => {
  console.log('init wasm-pack');
});
*/