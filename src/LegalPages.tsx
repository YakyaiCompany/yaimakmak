interface LegalPageProps {
  onHome: () => void
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="ยักษ์ใหญ่ 2015">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-900 font-heading text-sm font-bold text-white" aria-hidden="true">
        YY
      </span>
      <span>
        <span className="block font-heading text-sm font-semibold leading-tight text-brand-900">ยักษ์ใหญ่ 2015</span>
        <span className="block text-[10px] leading-tight tracking-wide text-ink-700">Industrial Biomass Engineering</span>
      </span>
    </div>
  )
}

function HomeButton({ onHome, children = "กลับหน้าแรก" }: LegalPageProps & { children?: string }) {
  return (
    <button
      type="button"
      onClick={onHome}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-energy-600 px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-energy-400 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-energy-600"
    >
      <span aria-hidden="true">←</span>
      {children}
    </button>
  )
}

function SiteHeader({ onHome }: LegalPageProps) {
  return (
    <header className="border-b border-ink-300/70 bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-8">
        <button
          type="button"
          onClick={onHome}
          className="rounded-lg text-left focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-700"
          aria-label="กลับสู่หน้าแรกของยักษ์ใหญ่ 2015"
        >
          <BrandMark />
        </button>
        <HomeButton onHome={onHome} />
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink-300/70 bg-ink-100">
      <div className="mx-auto max-w-[1200px] px-5 py-6 text-center font-body text-sm text-ink-700 md:px-8">
        เอกสารนี้เป็นข้อมูลสำหรับเว็บไซต์ โปรดตรวจทานก่อนเผยแพร่
      </div>
    </footer>
  )
}

/** A Thai privacy-policy draft page requiring final legal review before publication. */
export function PrivacyPolicyPage({ onHome }: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink-950">
      <SiteHeader onHome={onHome} />

      <main id="main-content" className="flex-1">
        <section className="bg-brand-900 py-12 md:py-16" aria-labelledby="privacy-title">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <p className="font-body text-sm font-medium text-energy-400">ข้อมูลและความเป็นส่วนตัว</p>
            <h1 id="privacy-title" className="mt-2 font-heading text-3xl font-bold tracking-tight text-white md:text-4xl">
              นโยบายความเป็นส่วนตัว
            </h1>
            <p className="mt-4 max-w-2xl font-body leading-relaxed text-white/75">
              เอกสารฉบับร่างเพื่ออธิบายแนวทางการจัดการข้อมูลส่วนบุคคลบนเว็บไซต์
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
          <aside className="rounded-xl border border-energy-400/50 bg-amber-50 p-5 text-ink-950" aria-labelledby="review-notice-title">
            <h2 id="review-notice-title" className="font-heading text-lg font-semibold text-brand-900">
              โปรดตรวจทานก่อนเผยแพร่
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-700">
              ต้องยืนยันชื่อบริษัท รายละเอียดการดำเนินงานตามจริง ฐานกฎหมาย ระยะเวลาจัดเก็บ และช่องทางติดต่อกับผู้รับผิดชอบด้านกฎหมายหรือข้อมูลส่วนบุคคลก่อนนำหน้านี้เผยแพร่
              เนื้อหานี้ไม่ใช่คำรับรองว่าบริษัทมีแนวปฏิบัติใดอยู่แล้ว
            </p>
          </aside>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-ink-300 pb-6 font-body text-sm text-ink-700">
            <span className="font-semibold text-ink-950">วันที่มีผลบังคับใช้:</span>
            <span className="rounded bg-ink-100 px-2 py-0.5 font-medium text-brand-900">[ระบุวันที่มีผลบังคับใช้]</span>
          </div>

          <div className="mt-10 space-y-10 font-body leading-relaxed text-ink-700">
            <section aria-labelledby="privacy-purpose">
              <h2 id="privacy-purpose" className="font-heading text-2xl font-semibold text-brand-900">
                วัตถุประสงค์ของนโยบาย
              </h2>
              <p className="mt-3">
                หน้านี้มีวัตถุประสงค์เพื่ออธิบายให้ผู้ใช้งานทราบว่า ข้อมูลส่วนบุคคลที่ส่งผ่านเว็บไซต์อาจถูกจัดการเพื่อการตอบคำถาม การติดต่อกลับ การให้ข้อมูลเกี่ยวกับสินค้าและบริการ หรือวัตถุประสงค์อื่นที่บริษัทกำหนดและแจ้งให้ทราบอย่างชัดเจน
              </p>
            </section>

            <section aria-labelledby="privacy-collection">
              <h2 id="privacy-collection" className="font-heading text-2xl font-semibold text-brand-900">
                ข้อมูลที่อาจมีการเก็บรวบรวม
              </h2>
              <p className="mt-3">
                โปรดระบุข้อมูลที่เว็บไซต์เก็บตามการใช้งานจริงเท่านั้น เช่น ชื่อ ข้อมูลติดต่อ ชื่อบริษัท รายละเอียดความต้องการ หรือข้อมูลทางเทคนิคที่จำเป็นต่อการให้บริการ หากมีการใช้คุกกี้ แบบฟอร์ม หรือเครื่องมือวิเคราะห์ ควรอธิบายประเภทข้อมูล วัตถุประสงค์ และทางเลือกของผู้ใช้งานให้ครบถ้วน
              </p>
            </section>

            <section aria-labelledby="privacy-use">
              <h2 id="privacy-use" className="font-heading text-2xl font-semibold text-brand-900">
                การใช้และการเปิดเผยข้อมูล
              </h2>
              <p className="mt-3">
                ควรใช้ข้อมูลเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ได้แจ้งไว้ และระบุให้ชัดเจนว่าข้อมูลอาจถูกเปิดเผยแก่บุคคลหรือผู้ให้บริการประเภทใดบ้าง เมื่อมีความจำเป็นในการดำเนินงานหรือเมื่อกฎหมายกำหนด ทั้งนี้ รายละเอียดต้องผ่านการตรวจสอบให้สอดคล้องกับกระบวนการของบริษัทก่อนเผยแพร่
              </p>
            </section>

            <section aria-labelledby="privacy-retention">
              <h2 id="privacy-retention" className="font-heading text-2xl font-semibold text-brand-900">
                ระยะเวลาการเก็บรักษาและความปลอดภัย
              </h2>
              <p className="mt-3">
                โปรดระบุเกณฑ์หรือระยะเวลาการเก็บรักษาข้อมูลตามประเภทข้อมูลและความจำเป็นที่ตรวจสอบแล้ว รวมถึงมาตรการคุ้มครองที่สามารถยืนยันได้จริง หลีกเลี่ยงการระบุคำรับรองด้านความปลอดภัยหรือระยะเวลาที่ไม่ตรงกับแนวปฏิบัติของบริษัท
              </p>
            </section>

            <section aria-labelledby="privacy-rights">
              <h2 id="privacy-rights" className="font-heading text-2xl font-semibold text-brand-900">
                สิทธิของเจ้าของข้อมูล
              </h2>
              <p className="mt-3">
                ผู้ใช้งานอาจมีสิทธิเกี่ยวกับข้อมูลส่วนบุคคลตามกฎหมายที่ใช้บังคับ เช่น การขอเข้าถึง แก้ไข ลบ คัดค้าน หรือจำกัดการใช้ข้อมูล ทั้งนี้ ขอบเขต เงื่อนไข และขั้นตอนการใช้สิทธิควรได้รับการยืนยันโดยผู้เชี่ยวชาญก่อนเผยแพร่
              </p>
            </section>

            <section aria-labelledby="privacy-contact">
              <h2 id="privacy-contact" className="font-heading text-2xl font-semibold text-brand-900">
                ติดต่อเกี่ยวกับข้อมูลส่วนบุคคล
              </h2>
              <p className="mt-3">
                สำหรับคำถามหรือคำขอเกี่ยวกับข้อมูลส่วนบุคคล โปรดติดต่อ <span className="font-medium text-brand-900">[ระบุชื่อหน่วยงานหรือผู้รับผิดชอบ]</span> ผ่าน <span className="font-medium text-brand-900">[ระบุอีเมล / โทรศัพท์ / ที่อยู่สำหรับติดต่อ]</span>
              </p>
              <p className="mt-3 text-sm">
                ข้อมูลติดต่อและสถานะผู้รับผิดชอบในส่วนนี้เป็นช่องว่างสำหรับกรอกข้อมูลที่ผ่านการตรวจสอบแล้วเท่านั้น
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-2xl bg-ink-100 p-6 md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-brand-900">ต้องการกลับไปยังเว็บไซต์?</h2>
              <p className="mt-1 font-body text-sm text-ink-700">คุณสามารถกลับสู่หน้าแรกได้ทุกเมื่อ</p>
            </div>
            <div className="mt-5 md:mt-0"><HomeButton onHome={onHome} /></div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

/** A standalone Thai 404 page. */
export function NotFoundPage({ onHome }: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink-950">
      <SiteHeader onHome={onHome} />

      <main id="main-content" className="flex flex-1 items-center" aria-labelledby="not-found-title">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="font-heading text-7xl font-bold leading-none text-energy-600 md:text-9xl" aria-hidden="true">404</p>
          <p className="mt-6 font-body text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">ไม่พบหน้าที่ต้องการ</p>
          <h1 id="not-found-title" className="mt-3 font-heading text-3xl font-bold text-brand-900 md:text-4xl">
            ขออภัย ไม่พบหน้านี้
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-ink-700">
            ลิงก์ที่คุณเปิดอาจไม่ถูกต้อง หน้าดังกล่าวอาจถูกย้าย หรือไม่มีอยู่ในเว็บไซต์แล้ว ลองกลับไปเริ่มต้นจากหน้าแรกได้เลย
          </p>
          <div className="mt-8"><HomeButton onHome={onHome} children="กลับสู่หน้าแรก" /></div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
