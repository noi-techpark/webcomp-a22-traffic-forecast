import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: 'hello-world',
  // styleUrl: 'app-profile.css',
  shadow: true,
})
export class HelloWorld {
  @Prop() name: string;


  render() {
    return (
      <h1>
        {this.name}
      </h1>
    );
  }

}
