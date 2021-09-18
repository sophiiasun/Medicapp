const imageUpload = document.getElementById('imageUpload')
const container = document.getElementById('container')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)


function start() {
  container.style.position = 'relative'
  let image
  let canvas
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image) 
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = {width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize) 
    resizedDetections.forEach(detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, {label: 'Face'})
      drawBox.draw(canvas)
    })
  })
  console.log("done") 
}

// function loadLabeledImages() {
//   const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
//   return Promise.all(
//     labels.map(async label => {
//       const descriptions = []
//       for (let i = 1; i <= 2; i++) {
//         const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         descriptions.push(detections.descriptor)
//       }
//       return new faceapi.LabeledFaceDescriptors(label, descriptions)
//     })
//   )
// }

// function startVideo() {
//   document.body.append('loaded')
//   console.log("hi"); 
  // navigator.getUserMedia(
  //   { video: {} },
  //   stream => video.srcObject = stream,
  //   err => console.error(err)
  // )
//}

// video.addEventListener('play', () => {
//   // const canvas = faceapi.createCanvasFromMedia(video)
//   // // container.append(canvas)
//   // const displaySize = { width: video.width, height: video.height }
//   // faceapi.matchDimensions(canvas, displaySize)
//   // setInterval(async () => {
//   //   const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
//   //   const resizedDetections = faceapi.resizeResults(detections, displaySize)
//   //   canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
//   //   faceapi.draw.drawDetections(canvas, resizedDetections)
//   //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
//   // }, 100)
// })