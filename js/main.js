/*
 ***************************************
 * *************************************
 *  https://aladhan.com/prayer-times-api
 *
 *  ************************************
 * *************************************
 */

let city = "Cairo";

set_city(city);

set_current_time();

const end_point = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=egypt`;

axios
  .get(end_point)
  .then(({ data }) => {
    // render all dates
    set_current_dates(data.data.date);
    // render all aladhan times
    set_aladhan_timings(data.data.timings);
  })
  .catch((error) => {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.log("something went wrong...");
    }
  });

/******************************* Helper Methods ****************************/

/************************ Render City Name ON The DOM *********************/
function set_city(city) {
  document.querySelector(".city").innerHTML = city;
}

/************************ Render Current Time ON The DOM *********************/
function set_current_time() {
  let ele = document.querySelector(".current-time");

  function update_time() {
    ele.innerHTML = moment().format("LTS");
  }

  update_time();

  setInterval(update_time, 1000);
}

/************************ Render Current Dates ON The DOM *********************/
function set_current_dates({ gregorian, hijri }) {
  get_day_name(hijri);
  get_hijri_date(hijri);
  get_gregorian_date(gregorian);
}

function get_hijri_date({ day, month, year }) {
  const higri_date = `${day} - ${month.ar} - ${year}`;
  document.querySelector(".date .hijri").innerHTML = higri_date;
}

function get_gregorian_date({ day, month, year }) {
  const gregorian_date = `${day} - ${months[month.number]} - ${year}`;
  document.querySelector(".date .gregorian").innerHTML = gregorian_date;
}

function get_day_name(hijri) {
  document.querySelector(".date .day").innerHTML = hijri.weekday.ar;
}

/************************ Render Aladhan Times ON The DOM *********************/
function set_aladhan_timings(timings) {
  const athan_timings = get_aladhan_timings(timings);

  const content = Object.entries(athan_timings)
    .map(([key, value]) => create_item(key, value))
    .join("");

  document.querySelector(".times").innerHTML = content;
}

/************************ Create Aladhan Single Item **********************/
function create_item(name, time) {
  return `
    <div class="item my-2 rounded d-flex py-2 px-3 justify-content-between fs-4 text-bg-light">
      <div class="name">${name}</div>
      <div class="time">${moment(time, "hh:mm").format("LT")}</div>
    </div>
  `;
}

/************************ Get Specific Data To Render **********************/
function get_aladhan_timings({ Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha }) {
  return {
    الفجر: Fajr,
    الشروق: Sunrise,
    الضهر: Dhuhr,
    العصر: Asr,
    المغرب: Maghrib,
    العشاء: Isha,
  };
}

/************************ To Render Month Name In Arabic **********************/
const months = {
  1: "يناير",
  2: "فبراير",
  3: "مارس",
  4: "ابريل",
  5: "مايو",
  6: "يونيو",
  7: "يوليو",
  8: "اغسطس",
  9: "سبتمبر",
  10: "اكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};
