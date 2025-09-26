module.exports = {
	name: process.env.NODE_ENV === "development" ? "dev_backend" : "backend", // Name of your application
	script: "src/index.ts", // Entry point of your application
	interpreter: "bun", // Bun interpreter
	env: {
		PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, // Add "~/.bun/bin/bun" to PATH
	},
};
