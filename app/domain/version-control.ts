interface Commit<T> {
  at: Date
  redoArgs: T[]
  undoArgs: T[]
}

export class VersionControl<Args> {
  private HEAD = -1
  private commits: Commit<Args>[] = []

  constructor(private onApply: (...args: Args[]) => Args[]) {}

  commit(...args: NoInfer<Args>[]): number {
    let undoArgs = this.onApply(...args)
    let commit = { redoArgs: args, undoArgs, at: new Date() }
    this.HEAD = this.commits.push(commit) - 1
    return this.HEAD
  }

  // Jump to a specific commit
  checkout(idx: number) {
    // Already at the commit
    if (idx === this.HEAD) return

    // Going back to the commit
    if (idx < this.HEAD) {
      let commits = this.commits.slice(idx + 1, this.HEAD + 1).reverse()

      // Undo the commits
      for (let commit of commits) {
        this.onApply(...commit.undoArgs)
      }
    } else {
      let commits = this.commits.slice(this.HEAD + 1, idx + 1)

      // Redo the commits
      for (let commit of commits) {
        this.onApply(...commit.redoArgs)
      }
    }

    // Update the HEAD
    this.HEAD = idx
  }

  // Going forward to the latest commit
  head() {
    // Already at the latest commit
    if (this.HEAD === this.commits.length - 1) return

    let commits = this.commits.slice(this.HEAD + 1)

    // Redo the commits
    for (let commit of commits) {
      this.onApply(...commit.redoArgs)
    }

    // Update the HEAD
    this.HEAD = this.commits.length - 1
  }

  // Going back 1 commit at a time
  undo() {
    let commit = this.commits[this.HEAD]
    if (!commit) return

    // Undo the commit
    this.onApply(...commit.undoArgs)

    this.HEAD = Math.max(0, this.HEAD - 1)
  }

  // Going forward 1 commit at a time
  redo() {
    let commit = this.commits[this.HEAD]
    if (!commit) return

    // Redo the commit
    this.onApply(...commit.redoArgs)

    this.HEAD = Math.min(this.commits.length - 1, this.HEAD + 1)
  }
}
