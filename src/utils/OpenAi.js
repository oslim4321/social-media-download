import { createParser } from "eventsource-parser";

export async function OpenAIStream(payload) {
  let url = "https://api.openai.com/v1/chat/completions";
  //   console.log("i am runnin", payload);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      //   function onParse(event) {
      //     if (event.type === "event") {
      //       const data = event.data;
      //       if (data === "[DONE]") {
      //         controller.close();
      //         return;
      //       }
      //       try {
      //         const json = JSON.parse(data);
      //         console.log(json.choices.length, "json");
      //         const text = json.choices[0].delta?.content || "";
      //         if (counter < 2 && (text.match(/\n/) || []).length) {
      //           return;
      //         }
      //         const queue = encoder.encode(text);
      //         controller.enqueue(queue);
      //         counter++;
      //       } catch (e) {
      //         // maybe parse error
      //         controller.error(e);
      //       }
      //     }
      //   }
      function onParse(event) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            // console.log(json.choices.length, "json");
            for (let i = 0; i < json.choices.length; i++) {
              const text = json.choices[i].delta?.content || "";
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            }
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
