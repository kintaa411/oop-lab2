class Course {
    private capacity: number = 30;
    private enrolledStudents: string[] = [];
    private registrationOpen: boolean = true;

    enroll(student: string): boolean {
        if (!this.registrationOpen) {
            console.log("Registration is closed");
            return false;
        }

        if (this.enrolledStudents.includes(student)) {
            console.log("Student already enrolled");
            return false;
        }

        if (this.enrolledStudents.length >= this.capacity) {
            console.log("Course is full");
            return false;
        }

        this.enrolledStudents.push(student);
        console.log(`${student} enrolled successfully`);
        return true;
    }

    closeRegistration(): void {
        this.registrationOpen = false;
        console.log("Registration closed");
    }

    withdraw(student: string): boolean {
        const index = this.enrolledStudents.indexOf(student);

        if (index === -1) {
            console.log("Student not found");
            return false;
        }

        this.enrolledStudents.splice(index, 1);
        console.log(`${student} withdrew`);
        return true;
    }

    getEnrollmentCount(): number {
        return this.enrolledStudents.length;
    }
}

const oop = new Course();

oop.enroll("Rose");
oop.enroll("John");

console.log("Number of students:", oop.getEnrollmentCount());
