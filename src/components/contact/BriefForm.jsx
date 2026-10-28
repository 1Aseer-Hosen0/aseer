import { useRef, useState } from "react";
import { SITE } from "../../data/site";
import { Button } from "../ui/Button";

const NEEDS_OPTIONS = [
  "Interface design",
  "Frontend development",
  "Motion & interaction",
  "Let's Discuss",
];

export function BriefForm({ formData, setFormData, isReady }) {
  const [msg, setMsg] = useState("Reply within 24h · Everyday");
  const [msgClass, setMsgClass] = useState("mono text-dim");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const { from, email, company, needs, brief, consent } =
    formData;

  const countWords = (s) => (s.trim().match(/\S+/g) || []).length;

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "brief") {
        next.words = countWords(value);
      }
      return next;
    });
  };

  const handleTextareaInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    handleInputChange("brief", e.target.value);
  };

  const toggleNeed = (option) => {
    setFormData((prev) => {
      const nextNeeds = new Set(prev.needs);
      if (nextNeeds.has(option)) {
        nextNeeds.delete(option);
      } else {
        nextNeeds.add(option);
      }
      return { ...prev, needs: nextNeeds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady || submitting) return;

    setSubmitting(true);
    const payload = {
      from: from.trim(),
      email: email.trim(),
      company: company.trim() || null,
      needs: needs.size ? Array.from(needs) : null,
      brief: brief.trim(),
      words: countWords(brief),
    };

    if (SITE.endpoint) {
      try {
        await fetch(SITE.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setMsg("Sent. I’ll reply within 24h.");
        setMsgClass("mono text-cyan");
      } catch {
        setMsg("Something failed. Please email me directly.");
        setMsgClass("mono text-dim");
        setSubmitting(false);
      }
    } else {
      const subject = encodeURIComponent(`Brief from ${payload.from}`);
      const body = encodeURIComponent(JSON.stringify(payload, null, 2));
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setMsg("Opening your email app…");
      setTimeout(() => setSubmitting(false), 2000);
    }
  };

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
      className="lg:col-span-7 flex flex-col gap-10 md:gap-12"
      novalidate
    >
      <div className="fld" data-rv>
        <label htmlFor="nm" className="lb flex justify-between mono text-dim">
          <span>
            <b className="font-normal text-mute mr-3">01</b>Your name
          </span>
          <span>Required</span>
        </label>
        <input
          id="nm"
          className="inp"
          autoComplete="name"
          placeholder="Jane Doe"
          value={from}
          onChange={(e) => handleInputChange("from", e.target.value)}
        />
        <i className="fl" />
      </div>

      <div className="fld" data-rv>
        <label htmlFor="em" className="lb flex justify-between mono text-dim">
          <span>
            <b className="font-normal text-mute mr-3">02</b>Email
          </span>
          <span>Required</span>
        </label>
        <input
          id="em"
          type="email"
          className="inp"
          autoComplete="email"
          placeholder="jane@studio.com"
          value={email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <i className="fl" />
      </div>

      <div className="fld" data-rv>
        <label htmlFor="co" className="lb flex justify-between mono text-dim">
          <span>
            <b className="font-normal text-mute mr-3">03</b>Studio or company
          </span>
          <span>Optional</span>
        </label>
        <input
          id="co"
          className="inp"
          autoComplete="organization"
          placeholder="Where you work"
          value={company}
          onChange={(e) => handleInputChange("company", e.target.value)}
        />
        <i className="fl" />
      </div>

      <fieldset data-rv>
        <legend className="flex justify-between w-full mono text-dim mb-4">
          <span>
            <b className="font-normal text-mute mr-3">04</b>What do you need?
          </span>
          <span>Pick any</span>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {NEEDS_OPTIONS.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant="ghost"
              data-g="needs"
              aria-pressed={needs.has(opt)}
              onClick={() => toggleNeed(opt)}
              data-cursor="link"
            >
              {opt}
            </Button>
          ))}
        </div>
      </fieldset>

      <div className="fld" data-rv>
        <label htmlFor="bf" className="lb flex justify-between mono text-dim">
          <span>
            <b className="font-normal text-mute mr-3">05</b>The brief
          </span>
          <span>
            <span id="wc">{countWords(brief)}</span> words · Required
          </span>
        </label>
        <textarea
          id="bf"
          ref={textareaRef}
          rows={3}
          className="inp"
          placeholder="What are you making, for whom, and by when?"
          value={brief}
          onInput={handleTextareaInput}
        />
        <i className="fl" />
      </div>

      <div className="flex flex-col gap-4 text-[15px] text-mute" data-rv>

        <label
          className="chk relative flex gap-3 items-start cursor-pointer"
          data-cursor="link"
        >
          <input
            id="ok"
            type="checkbox"
            checked={consent}
            onChange={(e) => handleInputChange("consent", e.target.checked)}
          />
          <span className="box mt-0.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="#0A0A0A"
              stroke-width="2"
            >
              <path d="M2 6.5l2.6 2.5L10 3.5" />
            </svg>
          </span>
          <span>
            My data is used only to reply to me, as described in the{" "}
            <a
              href="#"
              className="text-ink underline underline-offset-4 decoration-white/30 hover:decoration-cyan"
            >
              privacy policy
            </a>
            . <span className="mono text-dim ml-1">Required</span>
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-5" data-rv>
        <Button
          id="send"
          type="submit"
          className="btn btn-contact text-ink cursor-pointer"
          disabled={!isReady || submitting}
          data-cursor="link"
          magnetic
        >
          Send the brief →
        </Button>
        <span id="msg" className={msgClass}>
          {msg}
        </span>
      </div>
    </form>
  );
}
