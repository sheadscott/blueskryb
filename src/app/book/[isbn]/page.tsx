// export async function GET(request: Request) {
//   const userAgent = request.headers.get('user-agent') || ''
//   const isBot =
//     /apple.*|facebook.*|linkedin.*|twitter.*|pinterest.*|whatsapp.*|slack.*|discord.*|mastodon.*|b(lue)?sky.*/i.test(
//       userAgent
//     )

//   if (isBot) {
//     // Serve OG image or metadata
//   } else {
//     // Serve normal page or redirect
//   }
// }
export default function BookPage() {
  return <div>Book details here</div>
}
