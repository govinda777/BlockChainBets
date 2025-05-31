# BlockchainBets Smart Contract Development Environment

This directory contains the Foundry project for the BlockchainBets smart contracts.

## Current Status & Known Issues

A basic Foundry project structure has been initialized using `forge init --no-git --force`. This successfully set up the project and included the `forge-std` library.

**Dependency Installation Challenges:**

Attempts to install additional external dependencies, such as `OpenZeppelin/openzeppelin-contracts`, using `forge install <dependency_name> --no-commit` (or without `--no-commit`) have consistently failed within the current development environment.

The primary issue appears to be related to how the environment's tooling (specifically its internal Git post-processing steps) handles the creation of new, nested directories by the `forge install` command. When `forge install` creates directories for the new library (e.g., `lib/openzeppelin-contracts/`), subsequent internal checks seem to misinterpret these directories as files, leading to errors like:

`ValueError: Unexpected error: return_code: 1 stderr_contents: "cat: /app/contracts/lib/openzeppelin-contracts: Is a directory"`

This error suggests that a command like `cat` is being invoked on a directory path, which is invalid. This typically happens when Git commands (like `git diff` or `git add -A` which might be run internally by the tooling after a file operation) process the newly added library which might be seen as a submodule or a collection of untracked files and directories.

**Implications:**

This currently blocks the standard Foundry workflow for managing external dependencies. Workarounds, such as manually vendoring (copy-pasting) contract source code, might be necessary if the issue cannot be resolved at the environment level.

**Next Steps:**

The development of `BettingSystem.sol` will proceed, attempting to manually include necessary code from OpenZeppelin (like `IERC20.sol` and `SafeERC20.sol`) or by simplifying the contract to reduce external dependencies if manual inclusion proves too complex under these constraints.
