export default {
    async fetch(request, env, ctx) {
        // 요청 메서드 검증
        if (request.method !== "POST") {
            return new Response("Only POST requests are allowed.", { status: 405 });
        }

        try {
            // 클라이언트에서 보낸 데이터 읽기
            const { question } = await request.json();
            if (!question) {
                return new Response(JSON.stringify({ error: "질문을 제공해주세요." }), {
                    headers: { "Content-Type": "application/json" },
                    status: 400,
                });
            }

            // OpenAI API 호출 설정
            const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
            const OPENAI_API_KEY = "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";

            const openaiResponse = await fetch(OPENAI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "당신은 얼룩 제거 전문가입니다. 사용자의 질문에 체계적으로 답변하세요." },
                        { role: "user", content: question },
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            });

            // OpenAI 응답 처리
            const openaiData = await openaiResponse.json();

            if (!openaiResponse.ok) {
                return new Response(JSON.stringify(openaiData), {
                    headers: { "Content-Type": "application/json" },
                    status: openaiResponse.status,
                });
            }

            const answer = openaiData.choices[0].message.content;
            return new Response(JSON.stringify({ answer }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        } catch (error) {
            console.error("Error during API call:", error);
            return new Response(JSON.stringify({ error: "서버 오류가 발생했습니다." }), {
                headers: { "Content-Type": "application/json" },
                status: 500,
            });
        }
    },
};