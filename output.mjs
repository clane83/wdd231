export function setTitle(course) {
    document.querySelector("#courseName").textContent = course.name;
    document.querySelector("#courseCode").textContent = course.code;
  }
  
  export function renderSections(sections) {
    const html = sections.map(
      (section) => `
        <tr>
          <td>${section.sectionNumber}</td>
          <td>${section.enrolled}</td>
          <td>${section.instructor}</td>
        </tr>`
    );
    document.querySelector("#sections").innerHTML = html.join("");
  }

  export function setTitle(course) {
    document.querySelector("#courseName").textContent = course.name;
    document.querySelector("#courseCode").textContent = course.code;
  }
  
  export function renderSections(sections) {
    const html = sections.map(
      (section) => `
        <tr>
          <td>${section.sectionNumber}</td>
          <td>${section.enrolled}</td>
          <td>${section.instructor}</td>
        </tr>`
    );
    document.querySelector("#sections").innerHTML = html.join("");
  }




// Import the byuiCourse object from Course.mjs
import byuiCourse from 'Course.mjs';

// Import the setSectionSelection function from Sections.mjs
import { setSectionSelection } from 'Sections.mjs';

// Import the named function exports from Output.mjs
import { setTitle, renderSections } from 'Output.mjs';


// Set the title of the course
setTitle(byuiCourse);

// Populate the sections dropdown
setSectionSelection(byuiCourse.sections);

// Render the sections table
renderSections(byuiCourse.sections);

// Event listeners for enrolling and dropping students
document.querySelector("#enrollStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum);
  renderSections(byuiCourse.sections); // Update the output
});

document.querySelector("#dropStudent").addEventListener("click", function () {
  const sectionNum = Number(document.querySelector("#sectionNumber").value);
  byuiCourse.changeEnrollment(sectionNum, false);
  renderSections(byuiCourse.sections); // Update the output
});