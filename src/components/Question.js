export default function Question(props) {
  function correctString(incorrectString) {
    const halfcorrect = incorrectString.replace(/&quot;/g, '"');
    const fullcorrect = halfcorrect.replace(/&#039;/g, "'");
    return fullcorrect;
  }

  const options = props.options.map((opt) => {
    let a = "individual-options after-clicking";
    if (props.isClicked && opt.opt === props.correct) {
      a = "individual-options correct-answer";
    } else if (props.isClicked && opt.isSelected) {
      a = "individual-options after-clicking incorrect-answer";
    }

    return props.isClicked ? (
      <div className={a} key={opt.id}>
        {correctString(opt.opt)}
      </div>
    ) : (
      <div
        className={
          opt.isSelected === 0
            ? "individual-options"
            : "individual-options selected"
        }
        key={opt.id}
        onClick={() => props.selectOption(props.quesid, opt.id)}
      >
        {correctString(opt.opt)}
      </div>
    );
  });

  return (
    <div className="individual-questions">
      <h2 className="question-title">{correctString(props.ques)}</h2>
      <div className="question-options">{options}</div>
      <hr className="horizontal-line" />
    </div>
  );
}
