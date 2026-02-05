# Contributing to Talka

Thank you for your interest in contributing to Talka! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python/Node version, GPU/CPU)
- Error messages or logs

### Suggesting Enhancements

For feature requests:
- Describe the feature clearly
- Explain the use case
- Consider alternatives
- Be open to discussion

### Pull Requests

1. **Fork the repository** and create your branch from `main`:
```bash
git checkout -b feature/my-new-feature
```

2. **Make your changes**:
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed
   - Keep commits atomic and well-described

3. **Test your changes**:
   - Test backend changes with pytest
   - Test frontend changes manually
   - Ensure existing tests pass

4. **Commit your changes**:
```bash
git commit -m "Add feature: description of your feature"
```

5. **Push to your fork**:
```bash
git push origin feature/my-new-feature
```

6. **Open a Pull Request**:
   - Describe what changes you made
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Python (Backend)

- Follow PEP 8
- Use type hints where appropriate
- Add docstrings to functions and classes
- Use meaningful variable names

```python
def generate_speech(
    text: str,
    speed: float = 1.0,
    pitch: float = 1.0
) -> Tuple[str, float]:
    """
    Generate speech from text.
    
    Args:
        text: Input text to convert
        speed: Speech speed multiplier (0.5-2.0)
        pitch: Pitch multiplier (0.5-2.0)
        
    Returns:
        Tuple of (output_path, duration)
    """
    pass
```

### TypeScript/React (Frontend)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components focused and reusable

```typescript
interface TTSRequest {
  text: string;
  speed: number;
  pitch: number;
}

const generateSpeech = async (request: TTSRequest): Promise<void> => {
  // Implementation
};
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Documentation

- Update README.md if adding features
- Add API documentation for new endpoints
- Include examples in code comments
- Update API_TESTING.md for new endpoints

## Areas for Contribution

### High Priority
- Additional language support
- Improved voice cloning accuracy
- Performance optimizations
- Mobile responsive improvements
- Better error handling

### Features
- Batch processing
- Audio effects (reverb, echo, etc.)
- Voice mixing/blending
- Export to different formats
- Voice presets

### Infrastructure
- Automated tests
- CI/CD pipeline
- Docker optimizations
- Database migrations
- Monitoring and logging

### Documentation
- Video tutorials
- Deployment guides
- Troubleshooting guides
- API client libraries

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
