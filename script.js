const scriptURL = 'https://script.google.com/macros/s/AKfycbzjxr6a7EBu1TRB8Yk7uZ8-OJyHa6LedX2Z5B-Y5IUVIzLsOdNguUmciVb-KdxqypLb/exec'
const form = document.forms['submit-to-google-sheet']
const msg = document.getElementById("msg")

let isSubmitting = false

function formatPhoneNumber(phone) {
    phone = phone.replace(/\s+/g, '').replace(/-/g, '')

    // 0412345678 → +61412345678
    if (phone.startsWith("04") && phone.length === 10) {
        return "+61" + phone.substring(1)
    }

    // already formatted
    if (phone.startsWith("+61") && phone.length === 12) {
        return phone
    }

    // 61412345678 → +61412345678
    if (phone.startsWith("61") && phone.length === 11) {
        return "+" + phone
    }

    return null
}

form.addEventListener('submit', e => {
    e.preventDefault()

    if (isSubmitting) return
    isSubmitting = true

    const button = form.querySelector("button")

    button.disabled = true
    button.innerText = "SENDING..."

    const phoneInput = form.Phone.value
    const formattedPhone = formatPhoneNumber(phoneInput)

if (!formattedPhone) {
    msg.innerHTML = "ENTER A VALID AUSTRALIAN MOBILE NUMBER"

    setTimeout(function () {
        msg.innerHTML = ""
    }, 10000)

    isSubmitting = false
    button.disabled = false
    button.innerText = "SUBMIT"

    return
}

    form.Phone.value = formattedPhone

    fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.text())
    .then(data => {

        msg.innerHTML = "ALL SET, YOUR DETAILS WERE SENT"

        setTimeout(function () {
            msg.innerHTML = ""
        }, 10000)

        form.reset()

        isSubmitting = false
        button.disabled = false
        button.innerText = "SUBMIT"
    })
    .catch(error => {

        msg.innerHTML = "SOMETHING WENT WRONG"
        console.error('Error!', error.message)

        isSubmitting = false
        button.disabled = false
        button.innerText = "SUBMIT"
    })
})
