import { toolList } from './tools';

describe('toolList', () => {
  function expectTool(t: any): void {
    expect(t).toBeTruthy();
    if (!t) return;

    expect(typeof t.icon).toBe('string');
    expect(typeof t.start).toBe('function');
    expect(typeof t.update).toBe('function');
    expect(typeof t.end).toBe('function');
  }

  it('should only contain tools', () => {
    for (let tool of toolList) {
      expectTool(tool);
    }
  })
});
