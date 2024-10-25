
run: wasm
	npm run dev

wasm:
	cd m8-files; wasm-pack build --dev
