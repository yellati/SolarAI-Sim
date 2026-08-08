"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // THEME
    // ==============================

    const themeButton =
        document.getElementById("themeButton");

    const themeIcon =
        document.getElementById("themeIcon");

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );

                if (themeIcon) {

                    const dark =
                        document.body.classList.contains(
                            "dark-mode"
                        );

                    themeIcon.className =
                        dark
                            ? "fa-solid fa-moon"
                            : "fa-solid fa-sun";
                }
            }
        );
    }


    // ==============================
    // CHATBOT ELEMENTS
    // ==============================

    const aiButton =
        document.getElementById("aiButton");

    const chatbot =
        document.getElementById("chatbot");

    const closeChat =
        document.getElementById("closeChat");

    const chatInput =
        document.getElementById("chatInput");

    const sendMessage =
        document.getElementById("sendMessage");

    const chatMessages =
        document.getElementById("chatMessages");


    // ==============================
    // SOLAR INFORMATION
    // ==============================

    const solarInfo = {

        flatplate: {
            name: "Flat Plate Collector",
            keywords: [
                "flat plate",
                "flatplate"
            ],
            answer:
                "A Flat Plate Collector uses an absorber plate to capture solar radiation and transfer heat to a circulating fluid. It is commonly used for domestic hot water and low-temperature heating."
        },

        evacuated: {
            name: "Evacuated Tube Collector",
            keywords: [
                "evacuated",
                "evacuated tube"
            ],
            answer:
                "An Evacuated Tube Collector uses vacuum-insulated tubes to reduce heat loss. It can provide good thermal performance and is commonly used for hot-water and heating applications."
        },

        parabolic: {
            name: "Parabolic Trough",
            keywords: [
                "parabolic",
                "parabolic trough"
            ],
            answer:
                "A Parabolic Trough uses curved mirrors to concentrate sunlight onto a receiver tube. It is suitable for higher-temperature solar thermal applications."
        },

        fresnel: {
            name: "Linear Fresnel Collector",
            keywords: [
                "fresnel",
                "linear fresnel"
            ],
            answer:
                "A Linear Fresnel Collector uses multiple mirror strips to concentrate sunlight onto a receiver. It can be used for industrial heat and steam generation."
        },

        cpc: {
            name: "Compound Parabolic Collector",
            keywords: [
                "cpc",
                "compound parabolic"
            ],
            answer:
                "A Compound Parabolic Collector uses reflective surfaces to collect sunlight over a range of incoming angles and direct it toward an absorber."
        },

        heatpipe: {
            name: "Heat Pipe Collector",
            keywords: [
                "heat pipe",
                "heatpipe"
            ],
            answer:
                "A Heat Pipe Collector transfers thermal energy through sealed heat pipes using evaporation and condensation. This provides an efficient method of transferring solar heat."
        },

        thermosyphon: {
            name: "Thermosyphon System",
            keywords: [
                "thermosyphon",
                "thermosiphon"
            ],
            answer:
                "A Thermosyphon System uses natural circulation caused by temperature and density differences. It is commonly used in domestic solar water-heating systems."
        },

        storage: {
            name: "Integrated Storage Collector",
            keywords: [
                "storage",
                "integrated storage"
            ],
            answer:
                "An Integrated Storage Collector combines solar heat collection and thermal storage in one system. This makes it useful for compact solar water-heating applications."
        },

        unglazed: {
            name: "Unglazed Collector",
            keywords: [
                "unglazed"
            ],
            answer:
                "An Unglazed Collector does not use a glass cover and is generally designed for lower-temperature applications, especially swimming-pool heating."
        }

    };


    // ==============================
    // OPEN CHAT
    // ==============================

    function openChat() {

        if (!chatbot) return;

        chatbot.classList.add("open");

        chatbot.setAttribute(
            "aria-hidden",
            "false"
        );

        if (chatInput) {
            chatInput.focus();
        }
    }


    // ==============================
    // CLOSE CHAT
    // ==============================

    function closeChatWindow() {

        if (!chatbot) return;

        chatbot.classList.remove("open");

        chatbot.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    // ==============================
    // ADD MESSAGE
    // ==============================

    function addMessage(
        message,
        type
    ) {

        if (!chatMessages) return;

        const messageElement =
            document.createElement("div");

        messageElement.className =
            type === "user"
                ? "user-message"
                : "bot-message";

        messageElement.textContent =
            message;

        chatMessages.appendChild(
            messageElement
        );

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    // ==============================
    // FIND SOLAR COLLECTOR
    // ==============================

    function findCollector(question) {

        const text =
            question.toLowerCase();

        for (
            const key in solarInfo
        ) {

            const collector =
                solarInfo[key];

            for (
                const keyword of collector.keywords
            ) {

                if (
                    text.includes(keyword)
                ) {

                    return collector;
                }
            }
        }

        return null;
    }


    // ==============================
    // CHAT RESPONSE
    // ==============================

    function getResponse(question) {

        const text =
            question.toLowerCase().trim();


        const collector =
            findCollector(text);


        if (collector) {

            return collector.answer;
        }


        if (
            text.includes("compare")
        ) {

            return (
                "I can compare two collectors. " +
                "For example, ask: " +
                "\"Compare Flat Plate and Evacuated Tube collectors.\""
            );
        }


        if (
            text.includes("which") &&
            text.includes("water")
        ) {

            return (
                "For water-heating applications, " +
                "Flat Plate and Evacuated Tube collectors " +
                "are commonly considered."
            );
        }


        if (
            text.includes("hello") ||
            text.includes("hi")
        ) {

            return (
                "Hello! Ask me about any of the " +
                "9 solar collectors."
            );
        }


        return (
            "I can explain the 9 collectors on this page: " +
            "Flat Plate, Evacuated Tube, Parabolic Trough, " +
            "Linear Fresnel, CPC, Heat Pipe, Thermosyphon, " +
            "Integrated Storage, and Unglazed Collector."
        );
    }


    // ==============================
    // SEND MESSAGE
    // ==============================

    function sendUserMessage() {

        if (!chatInput) return;

        const question =
            chatInput.value.trim();


        if (!question) {
            return;
        }


        addMessage(
            question,
            "user"
        );


        chatInput.value = "";


        setTimeout(
            function () {

                const response =
                    getResponse(question);

                addMessage(
                    response,
                    "bot"
                );

            },
            300
        );
    }


    // ==============================
    // AI BUTTON
    // ==============================

    if (aiButton) {

        aiButton.addEventListener(
            "click",
            function () {

                if (
                    chatbot.classList.contains("open")
                ) {

                    closeChatWindow();

                } else {

                    openChat();

                }

            }
        );

    }


    // ==============================
    // CLOSE BUTTON
    // ==============================

    if (closeChat) {

        closeChat.addEventListener(
            "click",
            closeChatWindow
        );

    }


    // ==============================
    // SEND BUTTON
    // ==============================

    if (sendMessage) {

        sendMessage.addEventListener(
            "click",
            sendUserMessage
        );

    }


    // ==============================
    // ENTER KEY
    // ==============================

    if (chatInput) {

        chatInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    sendUserMessage();

                }

            }
        );

    }


    // ==============================
    // CARD CLICK
    // ==============================

    const cards =
        document.querySelectorAll(
            ".education-card"
        );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const collector =
                        card.dataset.collector;

                    if (
                        solarInfo[collector]
                    ) {

                        openChat();

                        setTimeout(
                            function () {

                                addMessage(
                                    "Explain " +
                                    solarInfo[collector].name,
                                    "user"
                                );

                                setTimeout(
                                    function () {

                                        addMessage(
                                            solarInfo[collector].answer,
                                            "bot"
                                        );

                                    },
                                    300
                                );

                            },
                            100
                        );

                    }

                }
            );

        }
    );


    console.log(
        "SolarAI Education Page Ready"
    );

});