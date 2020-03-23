new TypeIt("#type-effect", {
    speed: 150,
    startDelay: 2200
})
    .type("art")
    .pause(1500)
    .delete()
    .pause(100)
    .type("ideas")
    .pause(1000)
    .delete()
    .pause(100)
    .type("thoughts")
    .pause(1000)
    .delete()
    .pause(100)
    .type("basically anything else...")
    .go();
