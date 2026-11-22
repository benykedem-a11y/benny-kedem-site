# האתר של בני קדם – מטפל במגע

אתר של עמוד אחד, מתארח בחינם ב-GitHub Pages.

- **ביקורות מגוגל מתעדכנות לבד:** פעם ביום תהליך ב-GitHub Actions מושך מגוגל את הדירוג, מספר הביקורות ועד 5 ביקורות אחרונות, ושומר אותם ב-`data/reviews.json`. האתר קורא את הקובץ בכל טעינה.
- **כל פנייה מהטופס מגיעה לבני במייל** (דרך Web3Forms), ובנוסף נפתח למבקר וואטסאפ עם הודעה מוכנה. כך גם מי שלא שולח בוואטסאפ לא הולך לאיבוד.

## מבנה

| קובץ | מה הוא |
|---|---|
| `index.html` | האתר עצמו |
| `img/` | התמונות |
| `data/reviews.json` | הדירוג והביקורות (מתעדכן אוטומטית, לא לערוך ידנית) |
| `scripts/fetch-reviews.mjs` | הסקריפט שמושך מגוגל |
| `.github/workflows/update-reviews.yml` | מריץ את הסקריפט כל יום |

## הקמה (פעם אחת)

### 1. להפעיל את האתר
Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, תיקייה `/ (root)` → Save.
אחרי דקה-שתיים האתר זמין בכתובת `https://<שם-המשתמש>.github.io/benny-kedem-site/`.

### 2. מפתח לגוגל (בשביל הביקורות)
1. להיכנס ל-[Google Cloud Console](https://console.cloud.google.com/) וליצור פרויקט חדש.
2. APIs & Services → Library → להפעיל את **Places API (New)**.
3. גוגל דורשת לחבר חשבון חיוב (כרטיס אשראי), אבל השימוש שלנו בחינם: הסקריפט רץ פעם ביום, כ-30 קריאות בחודש, והמכסה החינמית לבקשות עם ביקורות היא 1,000 בחודש. מומלץ להגדיר Budget alert על 1$ ליתר ביטחון.
4. APIs & Services → Credentials → Create credentials → API key. ללחוץ על המפתח → API restrictions → לבחור רק **Places API (New)**.
5. בריפו: Settings → Secrets and variables → Actions → New repository secret
   שם: `GOOGLE_PLACES_API_KEY`, ערך: המפתח.
6. Actions → Update Google reviews → **Run workflow** כדי לבדוק שזה עובד.

### 3. מייל לכל פנייה
1. להיכנס ל-[web3forms.com](https://web3forms.com), להזין את המייל של בני וללחוץ Create Access Key. המפתח מגיע למייל.
2. ב-`index.html` למלא את השורה:
   ```js
   const WEB3FORMS_KEY = "המפתח-כאן";
   ```
   המפתח הזה מיועד להיות גלוי באתר, זה בסדר.
3. התוכנית החינמית: 250 פניות בחודש.

### 4. דומיין (כשנקנה)
Settings → Pages → Custom domain, ואצל ספק הדומיין להגדיר רשומות DNS לפי [ההוראות של GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## הערות
- גוגל מחזירה דרך ה-API עד 5 ביקורות בלבד, לפי הבחירה שלה. הדירוג ומספר הביקורות הם המלאים.
- בכל ריצה מתעדכן תאריך בקובץ, ולכן יש commit יומי. זה גם מונע מ-GitHub לכבות את התזמון (הוא מכבה תזמונים בריפו שלא היה בו שינוי 60 יום).
- אם המפתח של גוגל לא תקין, הריצה נכשלת והאתר ממשיך להציג את הנתונים האחרונים.

## קרדיט לתמונות
- `img/cupping.webp`: Jakub Klucky ב-[Unsplash](https://unsplash.com/), ברישיון Unsplash (שימוש חופשי).
