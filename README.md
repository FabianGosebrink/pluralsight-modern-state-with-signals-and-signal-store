# Pluralsight - Angular Deep Dive: Modern State with Signals and Signal Store

This repository contains the sample code for the Pluralsight course "Angular Deep Dive: Modern State with Signals and Signal Store".

## Overview

Learn modern state management patterns using Angular Signals and a simple Signal Store. The course walks through practical examples, patterns, and best practices to build reactive, maintainable state for modern Angular applications.

## What you'll learn

- Core concepts of Angular Signals
- Building a lightweight Signal Store for app-wide state
- Integrating signals with components and services
- Testing and debugging reactive state
- Migrating common state patterns to signals

## Setup

Install dependencies at the project root (or within each sample folder) using the `--legacy-peer-deps` option to avoid peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

If you prefer Yarn, you can run the equivalent Yarn install command in each sample folder.

## Running the samples

Each module (e.g., `m01`, `m02`, `m03`, ...) contains a sample Angular project. Typical steps to run a sample:

```bash
cd m01   # or the sample folder you want to run
npm install --legacy-peer-deps
npm start      # or `ng serve` depending on the sample's scripts
```

Check the module README files for module-specific instructions and scripts.

## Project Structure

- `m01/`, `m02/`, `m03/`, ... : Lesson modules and sample apps
- `backend/` : Minimal backend used by some samples

## Contributing

Contributions and fixes are welcome via pull requests. Please run the install step above with `--legacy-peer-deps` before opening PRs to ensure consistent dependency resolution.

## Author

Fabian Gosebrink
