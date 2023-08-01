"use strict";
let city = "Cairo";
set_city(city);
set_current_time();
const end_point = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=egypt`;
axios
    .get(end_point)
    .then(({ data }) => {
    set_current_dates(data.data.date);
    set_aladhan_timings(data.data.timings);
})
    .catch((error) => {
    if (axios.isAxiosError(error)) {
        console.log(error.message);
    }
    else {
        console.log("something went wrong...");
    }
});
function set_city(city) {
    document.querySelector(".city").innerHTML = city;
}
function set_current_time() {
    let ele = document.querySelector(".current-time");
    function update_time() {
        ele.innerHTML = moment().format("LTS");
    }
    update_time();
    setInterval(update_time, 1000);
}
function set_current_dates({ gregorian, hijri }) {
    get_day_name(hijri);
    get_hijri_date(hijri);
    get_gregorian_date(gregorian);
}
function get_hijri_date({ day, month, year }) {
    const date = `${day} - ${month.ar} - ${year}`;
    document.querySelector(".date .hijri").innerHTML = date;
}
function get_gregorian_date({ day, month, year }) {
    const month_ar = months[month.number];
    const date = `${day} - ${month_ar} - ${year}`;
    document.querySelector(".date .gregorian").innerHTML = date;
}
function get_day_name({ weekday }) {
    document.querySelector(".date .day").innerHTML = weekday.ar;
}
function set_aladhan_timings(timings) {
    const athan_timings = get_aladhan_timings(timings);
    const content = Object.entries(athan_timings)
        .map(([key, value]) => create_item(key, value))
        .join("");
    document.querySelector(".times").innerHTML = content;
}
function create_item(name, time) {
    return `
    <div class="item my-2 rounded d-flex py-2 px-3 justify-content-between fs-4 text-bg-light">
      <div class="name">${name}</div>
      <div class="time">${moment(time, "hh:mm").format("LT")}</div>
    </div>
  `;
}
function get_aladhan_timings(timings) {
    const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = timings;
    return {
        الفجر: Fajr,
        الشروق: Sunrise,
        الضهر: Dhuhr,
        العصر: Asr,
        المغرب: Maghrib,
        العشاء: Isha,
    };
}
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
//# sourceMappingURL=main.js.map