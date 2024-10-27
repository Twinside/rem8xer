
run: wasm
	npm run dev

wasm:
	cd m8-files; wasm-pack build --dev

release:
	cd m8-files; wasm-pack build --release
	npm run build

