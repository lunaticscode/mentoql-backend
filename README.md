## 🔥**MentorQL Backend**

- 이 문서는 mentoql-backend 프로젝트의 코어 로직인,
  멘토의 답변 데이터를 `Milvus 벡터 DB`에 저장할 때 질문/답변 텍스트의 길이 불균형으로 인한 `벡터 왜곡`을 방지하기 위한 전략을 설명함.

- 그리고 해당 전략을 코드레벨에서 어떻게 적용할 것인지 간략하게 기술함.

- **Text Embedding**은 `@xenova/transformers`를 사용.

- RAG에 사용될 LLM은 `openrouter.ai` 제공되는 `Llama 4 Maverick`을 사용.

---

## ✅ 전체 플로우 요약

1. 클라이언트로부터 질문(question)과 답변(answer)을 전달받음
2. 질문과 답변 텍스트의 길이를 비교하여 비중 산정
3. 질문 텍스트가 답변보다 길거나 비중이 25% 이상인 경우:  
   → **LLM을 통해 질문 요약** (25~30자 수준)
4. 요약 이후에도 비중이 맞지 않으면:  
   → **LLM을 통해 답변을 확장** (자연스럽게 의미 보강)
5. 최종적으로 질문:답변의 텍스트 비중을 25:75 ±2%로 맞춤
6. 질문/답변 각각 임베딩 후, **0.25:0.75 가중 평균 벡터 생성**
7. 해당 벡터를 Milvus의 `mentor_answers` 컬렉션에 저장

---

## 📐 비중 계산 기준

```ts
const questionRatio =
  (question.length / (question.length + answer.length)) * 100;
```

- ✅ 적정 범위: `23% ~ 27%`

---

## 🧠 LLM 처리 전략

### 📌 질문 요약 프롬프트 예시

```
이 질문을 25~30자 이내로 요약해줘.
최대한 핵심만 남기고 줄여줘.
```

### 📌 답변 확장 프롬프트 예시

```
아래 문장을 좀 더 구체적으로, 자연스럽게 60자 이상으로 풍부하게 설명해줘.
```

---

## 🔢 벡터 결합 방식 (가중 평균)

```ts
const combinedEmbedding = questionEmbedding.map(
  (q, i) => 0.25 * q + 0.75 * answerEmbedding[i]
);
```

- `questionEmbedding` / `answerEmbedding` 은 같은 모델로 생성되어야 하며, `dim`이 같아야 함.
- `@xenova/transformers` 사용(dim: 384)
- `metric_type`은 `COSINE`(코사인 유사도 방식)

---

## 💾 Milvus 저장 구조

컬렉션 이름: `mentor_answers`

| 필드명      | 타입        | 설명               |
| ----------- | ----------- | ------------------ |
| `id`        | Int64       | 기본 키            |
| `question`  | VarChar     | 요약된 질문 텍스트 |
| `answer`    | VarChar     | 확장된 답변 텍스트 |
| `embedding` | FloatVector | 384차원 벡터       |
| `mentor_id` | VarChar     | 멘토 식별자        |

---

## 📁 추천 함수 구조 (모듈화 기준)

- `summarizeQuestion(question: string, answer: string, recurCount: number): Promise<{q: string, a: string}>`
- `expandAnswer(text: string): Promise<string>`
- `generateBalancedEmbedding(question: string, answer: string): Promise<number[]>`
- `saveToMilvus(embedding: number[], question: string, answer: string, mentorId: string): Promise<void>`

---

## 🧪 보완 사항 및 예외 처리

| 상황                       | 대응 전략                           |
| -------------------------- | ----------------------------------- |
| LLM 호출 실패              | 원문 그대로 fallback 처리           |
| 답변이 너무 짧은 경우      | LLM으로 자동 확장                   |
| 질문/답변 둘 다 짧은 경우  | 임베딩만 실행, 별도 비중 체크 생략  |
| 벡터 길이 mismatch 발생 시 | 같은 임베딩 모델로 vector 생성할 것 |

---

## 🎯 목적 요약

- 질문과 문맥이 잘 맞는 멘토 답변을 효율적으로 찾기
- 벡터 왜곡을 줄이고 정보 밀도를 유지한 상태로 임베딩
- Milvus에서 정확한 질의 기반 검색 성능 확보

## Out of Scope

## 1. Feedback Loop 자동 개선 – 간단한 설계 아이디어

### 🔄 유저 인터랙션 기반 구조

| 이벤트                       | 처리 방식                        | 예시                               |
| ---------------------------- | -------------------------------- | ---------------------------------- |
| 멘티가 “도움 됐어요 👍” 클릭 | 해당 답변의 score +1             | ✅ 유지                            |
| “도움 안 됐어요 👎” 클릭     | LLM에게 수정 요청 → 새 버전 저장 | 🔄 개선된 답변 대체                |
| 멘토가 답변 수정             | 기존 벡터 갱신 or 새로 insert    | ✅ 멘토 신뢰도 향상 기반 학습 가능 |

---

### 🧠 자동 개선 흐름 예시

plaintext

복사편집

`멘티가 "도움 안 됐어요" 클릭   ⬇ 해당 질문 + 기존 답변 → LLM에게 수정 요청   ⬇ 수정된 답변을 기존 답변 벡터로 교체하거나 새로운 벡터로 저장   ⬇ 향후 동일 질문에 더 적절한 응답 유도`

---

### 💬 소개 문구 예시 (성장형 시스템 강조)

> "멘티의 피드백을 학습해가는 **성장형 멘토링 시스템**  
> – 질문이 많아질수록 더 똑똑해지는 응답을 제공합니다."

---

필요하면 이후에:

- Feedback 기록 구조 (`feedbacks` 테이블/컬렉션 설계)
- 수정된 답변이 기존보다 적합한지 판단하는 기준
- 멘토 피드백도 학습에 반영하는 고급 설계
