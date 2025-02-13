<div align='center'>
	<h1 align='center'>Competitive Reeling</h1>
	<img
	    src="https://img.shields.io/github/license/vincent-qc/competitive-reeling?style=for-the-badge"
	    alt="License"
	/>
	<img
		src='https://img.shields.io/github/languages/top/vincent-qc/competitive-reeling.svg?style=for-the-badge'
		alt='Language'
	/>
</div>

> A TartanHacks 2025 Submission

## What It Is
Given the current state of addictive short form content, we propose a suit of tools that competitifies Instagram reeling. We develop a chrome extension that procedurally scrapes the user's current reel, and we evaluate this content using a Vision LLM combined with a kNN keyword evaluator. Scores are then sent to a web dashboard where authenticated users can gain scores for certain (user-defined) catagories of content (e.g. `education`),  and lose scores for others, (e.g. `brain-rot`).


## Installation

To proceed with installation, first clone this repository.

**Web**

To install the web dashboard, inside the [web](/web) directory,
- `bun install`
- `bun dev`

**API**

To install the api, inside the [api](/api) directory,
- Install dependencies
- `python3 app.py`

**Extension**

The chrome extension can be installed by loading the scripts [here](/extension).


## License

Unless otherwise stated, all code belongs to 
- [vincent-qc](https://github.com/vincent-qc)
- [chennuode](https://github.com/ChenNuode)
- [emmadong05](https://github.com/emmadong05)
- [sahilmehta-us](https://github.com/sahilmehta-US).

All code in this project is maintained under the [MIT License](https://github.com/vincent-qc/blockout/blob/main/LICENSE).
