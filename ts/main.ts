/*
 ***************************************
 * *************************************
 *  https://aladhan.com/prayer-times-api
 *
 *  ************************************
 * *************************************
 */

type Timings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
};

type Hijri = {
  day: string;
  weekday: {
    ar: string;
  };
  month: {
    number: number;
    ar: string;
  };
  year: string;
};

type Gregorian = {
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
  };
  year: string;
};

type DateType = {
  hijri: Hijri;
  gregorian: Gregorian;
};

type GetTimesResponse = {
  data: {
    timings: Timings;
    date: DateType;
  };
};

let city = "Cairo";

set_city(city);

set_current_time();

const end_point = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=egypt`;

axios
  .get<GetTimesResponse>(end_point)
  .then(({ data }) => {
    set_current_dates(data.data.date);
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
function set_city(city: string) {
  (document.querySelector(".city") as Element).innerHTML = city;
}

/************************ Render Current Time ON The DOM *********************/
function set_current_time() {
  let ele = document.querySelector(".current-time") as Element;

  function update_time() {
    ele.innerHTML = moment().format("LTS");
  }

  update_time();

  setInterval(update_time, 1000);
}

/************************ Render Current Dates ON The DOM *********************/
function set_current_dates({ gregorian, hijri }: DateType) {
  get_day_name(hijri);

  get_hijri_date(hijri);

  get_gregorian_date(gregorian);
}

function get_hijri_date({ day, month, year }: Hijri) {
  const date = `${day} - ${month.ar} - ${year}`;

  (document.querySelector(".date .hijri") as Element).innerHTML = date;
}

function get_gregorian_date({ day, month, year }: Gregorian) {
  const month_ar = months[month.number as keyof typeof months];

  const date = `${day} - ${month_ar} - ${year}`;

  (document.querySelector(".date .gregorian") as Element).innerHTML = date;
}

function get_day_name({ weekday }: Hijri) {
  (document.querySelector(".date .day") as Element).innerHTML = weekday.ar;
}

/************************ Render Aladhan Times ON The DOM *********************/
function set_aladhan_timings(timings: Timings) {
  const athan_timings = get_aladhan_timings(timings);

  const content = Object.entries(athan_timings)
    .map(([key, value]) => create_item(key, value))
    .join("");

  (document.querySelector(".times") as Element).innerHTML = content;
}

/************************ Create Aladhan Single Item **********************/
function create_item(name: string, time: string) {
  return `
    <div class="item my-2 rounded d-flex py-2 px-3 justify-content-between fs-4 text-bg-light">
      <div class="name">${name}</div>
      <div class="time">${moment(time, "hh:mm").format("LT")}</div>
    </div>
  `;
}

/************************ Get Specific Data To Render **********************/
function get_aladhan_timings(timings: Timings) {
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
