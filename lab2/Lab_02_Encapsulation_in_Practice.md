# Object-Oriented Programming — DAUST Fall 2026

# Lab 2 — Encapsulation in Practice

Lab 1 ended on an open question: nothing stopped `oop.capacity = -100;`. This lab closes that door, examines exactly what kind of protection the language provides, and applies the design principles from Lecture 2 — first to the `Course` class, then to a domain you build from scratch.

Working method is unchanged: type the code yourself, write each **Prediction** down before running, and keep your answers somewhere you can refer back to them.

**Running and checking.** As in Lab 1, `node file.ts` runs your program. One fact becomes central today: `node` executes your TypeScript but does **not** type-check it. The type checker lives in VS Code — the red underlines that appear while you type are the TypeScript compiler. Running and checking are different steps.

---

## Part 0 — Starting Point

Create a folder `oop-lab2` and copy your `course.ts` from Lab 1 into it. If your Lab 1 version is incomplete, use the reference version published on Mycourses.

Verify it still behaves correctly:

```bash
node course.ts
```

**Checkpoint 0** — enrollment, the duplicate rule, `closeRegistration`, and `withdraw` all work as at the end of Lab 1.

---

## Part 1 — Three Bypass Attempts

The class owns three rules. Test whether outside code can ignore them. At the bottom of `course.ts`, add all three lines:

```typescript
oop.capacity = -100;                    // attempt 1
oop.enrolledStudents.push("Intruder");  // attempt 2 — bypasses every rule in enroll()
oop.registrationOpen = true;            // attempt 3 — re-opens a course that was closed
```

**Prediction 1.** For each attempt: will it run, and will it succeed? Write your answers down, then run the program and inspect the state with your print statements.

All three succeed. The rules exist, but nothing forces outside code to go through them. This is the situation described at the start of Lecture 2.

---

## Part 2 — Closing the Door

Mark all three fields `private`:

```typescript
class Course {
  private capacity = 30;
  private enrolledStudents: string[] = [];
  private registrationOpen = true;
  // ...
}
```

Look at the three bypass lines in VS Code: each now has a red underline. Hover over the first one.

**Question 1.** Copy the exact error message from the tooltip. It mentions `TS2341` and the word *private*. Read the entire message; interpreting compiler diagnostics is a skill this course practises deliberately.

---

## Part 3 — Running Versus Checking

The editor marks those three lines as errors. Leave them in the file anyway, and run it:

```bash
node course.ts
```

**Prediction 2.** Before running: will the program execute? Will the bypass attempts succeed?

**Question 2.** The program runs, and the attempts succeed — even though the editor marks those exact lines as errors. Explain why, using two facts from Lecture 2: what does `node` do with type annotations, and at what moment is `private` enforced?

This is the "honest precision" slide in practice: `private` is a compile-time guarantee, and `node` runs code without checking it. The practical rule that follows: never ignore a red underline — `node` will execute code the compiler has already identified as wrong.

Delete the three bypass lines.

---

## Part 4 — A Window Into the Object

One consequence of `private`: `console.log(oop.enrolledStudents)` now has a red underline as well. The program lost its window into the object.

**Task.** Add a read-only summary — a number, not the raw array:

```typescript
  getEnrollmentCount(): number {
    return this.enrolledStudents.length;
  }
```

Update your print statements to use it, and confirm the file has no red underlines anywhere.

**Question 3.** Lecture 2 argued that a class full of getters and setters is procedural code in OOP syntax — yet `getEnrollmentCount()` is acceptable. Why is it acceptable, while a `getEnrolledStudents()` returning the array would quietly re-enable bypass attempt 2? Consider what the caller can do with the returned array.

**Checkpoint 4** — no red underlines, and the program runs through the class's behaviour only.

---

## Part 5 — Refactor an "Ask" Caller

A teammate wrote this registration-page code against an early version of the class that exposed getters and setters:

```typescript
if (
  course.getRegistrationOpen() &&
  course.getEnrolledCount() < course.getCapacity() &&
  !course.getStudents().includes(student)
) {
  course.getStudents().push(student);
}
```

**Question 4.** Which invariants can this caller silently break today? Why will the situation worsen as rules are added (prerequisites, registration holds, deadlines)?

**Task.** Replace the entire block with the Tell version against your class, and confirm your class needs none of those four getters to exist:

```typescript
course.enroll(student);
```

**Checkpoint 5** — the refactored caller compiles and behaves correctly.

---

## Part 6 — A New Domain: The Library

This is the main construction work of the lab. Apply the full method — invariant, responsibility, state, behaviour, protection — to a domain not seen in the lectures' code.

A library starts with the procedural version from Lecture 2:

```typescript
let bookTitles: string[] = [];
let borrowed: boolean[] = [];

function addBook(title: string): void {
  bookTitles.push(title);
  borrowed.push(false);
}

function borrow(i: number): void {
  borrowed[i] = true;
}
```

A book that is already borrowed can be borrowed again.

**Task.** In a new file `book.ts`, design and implement a `Book` class. Work through the five design questions in order, writing your answers down before any code:

1. **The invariant.** What condition must always hold for a book?
2. **The responsibility.** Which entity decides whether a book can be borrowed?
3. **The state.** What does a `Book` own? Which fields must be `private`?
4. **The behaviour.** Define `borrow(): boolean` and `giveBack(): boolean`, each enforcing its rule. What does `giveBack()` return for a book that is not borrowed?
5. **The window.** What read-only query does outside code legitimately need? (Compare `getEnrollmentCount()`.)

**Prediction 3.** Before running: what does this print?

```typescript
const book = new Book("Clean Code");
console.log(book.borrow());   // ?
console.log(book.borrow());   // ?
console.log(book.giveBack()); // ?
console.log(book.giveBack()); // ?
```

Run it and compare.

**Question 5.** Attempt one bypass on your own class — for example, setting its borrowed status directly from outside. Confirm the editor rejects it, and copy the error message.

**Checkpoint 6** — `book.ts` enforces both invariants, and the bypass is rejected by the type checker.


## Summary

| You experienced | The name for it |
|---|---|
| Three bypasses succeeded | Behaviour without protection |
| `private` made them errors | Encapsulation |
| `node` ran them anyway | Checking and running are different steps |
| A count, not the raw array | The acceptable getter |
| Four getters replaced by `enroll(student)` | Tell, Don't Ask |
| `Book`, from invariant to protection | The method, in a new domain |
