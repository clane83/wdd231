const byuiCourse = {
    code: "WDD231",
    name: "Web Frontend Development I",
    sections: [
      {
        sectionNumber: 1,
        enrolled: 88,
        instructor: "Brother Bingham",
      },
      {
        sectionNumber: 2,
        enrolled: 81,
        instructor: "Sister Shultz",
      },
      {
        sectionNumber: 3,
        enrolled: 95,
        instructor: "Sister Smith",
      },
    ],

  };

  
  export function setSectionSelection() {
    const sectionSelect = document.querySelector("#sectionNumber");
    byuiCourse.sections.forEach((section) => {
      const option = document.createElement("option");
      option.value = section.sectionNumber;
      option.textContent = `${section.sectionNumber}`;
      sectionSelect.appendChild(option);
    });
  }

  export function populateSections(sections) {
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

  byuiCourse.changeEnrollment = function (sectionNumber, add = true) {
    // Find the section with the given section number
    const sectionIndex = this.sections.findIndex(
      (section) => section.sectionNumber == sectionNumber
    );
    if (sectionIndex >= 0) {
      if (add) {
        this.sections[sectionIndex].enrolled++;
      } else {
        this.sections[sectionIndex].enrolled--;
      }
      renderSections(this.sections);
    }
  },
  

  
  document.querySelector("#enrollStudent").addEventListener("click", function () {
    const sectionNum = Number(document.querySelector("#sectionNumber").value);
    byuiCourse.changeEnrollment(sectionNum);
  });
  document.querySelector("#dropStudent").addEventListener("click", function () {
    const sectionNum = Number(document.querySelector("#sectionNumber").value);
    byuiCourse.changeEnrollment(sectionNum, false);
  });

  import { setTitle, renderSections } from 'Output.mjs';

    // Use setTitle and renderSections as needed
    setTitle(byuiCourse);
    renderSections(byuiCourse.sections);
  
  
  setSectionSelection(byuiCourse.sections);
  

  export default byuiCourse;